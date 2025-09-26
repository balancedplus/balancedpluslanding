// lib/reservations.js
import { db } from "./firebase";
import { doc, runTransaction, Timestamp, serverTimestamp, arrayUnion, arrayRemove, getDoc, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Realiza la reserva de una clase para un usuario usando transacción
 */
export async function makeReservation({ user, cls }) {
  if (!user) throw new Error("Debes iniciar sesión para reservar");
  if (!cls || !cls.id) throw new Error("Clase inválida");

  const classRef = doc(db, "classes", cls.id);
  const userRef = doc(db, "users", user.uid);
  const reservationRef = doc(db, "reservations", `${cls.id}_${user.uid}`);

  try {
    await runTransaction(db, async (transaction) => {
      // Comprobar si ya existe una reserva activa
      const reservationSnap = await transaction.get(reservationRef);
      if (reservationSnap.exists() && reservationSnap.data().status === "active") {
        throw new Error("Ya tienes una reserva activa para esta clase");
      }

      // Obtener datos de la clase
      const classSnap = await transaction.get(classRef);
      if (!classSnap.exists()) throw new Error("Clase no encontrada");
      const classData = classSnap.data();
      
      // Verificar capacidad
      const capacityLeft = typeof classData.capacityLeft === "number"
        ? classData.capacityLeft
        : Math.max(0, (classData.capacity || 0) - (classData.atendees?.length || 0));

      if (capacityLeft <= 0) throw new Error("No quedan plazas disponibles");

      // Obtener datos del usuario
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw new Error("Usuario no encontrado");
      const userData = userSnap.data();

      // Verificar permisos y determinar método de pago
      const classType = cls.type.toLowerCase();
      const hasActiveSubscription = userData.subscription && 
        (userData.subscription.status === 'active' || userData.subscription.status === 'trialing');
      const hasCredits = userData.hasClassCredits === true && (userData.classCredits || 0) > 0;

      let updatedUserData = { ...userData };
      let paymentMethod = 'none';

      // Prioridad: suscripción primero, luego créditos
      if (hasActiveSubscription) {
        const classesLeft = updatedUserData.subscription.classesLeftThisPeriod[classType] || 0;
        const isFixedUser = updatedUserData.subscription.reservationType === 'fixed';
        const isUnlimitedPlan = classesLeft >= 99; // Planes con 99+ son "ilimitados"
        
        if (classesLeft > 0) {
          // Caso normal: tiene clases disponibles
          updatedUserData.subscription.classesLeftThisPeriod[classType] = Math.max(0, classesLeft - 1);
          paymentMethod = 'subscription';
        } else if (isFixedUser && classesLeft === 0 && !isUnlimitedPlan) {
          // Solo sobregiro para planes limitados con horario fijo
          updatedUserData.subscription.classesLeftThisPeriod[classType] = -1;
          paymentMethod = 'subscription';
        } else if (hasCredits) {
          // Siempre permitir créditos como alternativa
          updatedUserData.classCredits--;
          updatedUserData.hasClassCredits = updatedUserData.classCredits > 0;
          paymentMethod = 'credits';
        } else {
          throw new Error(`No te quedan clases disponibles de tipo ${cls.type}`);
        }

      } else if (hasCredits) {
        // Solo tiene créditos
        updatedUserData.classCredits--;
        updatedUserData.hasClassCredits = updatedUserData.classCredits > 0;
        paymentMethod = 'credits';
      } else {
        throw new Error("No tienes acceso para reservar clases");
      }

      // Crear la reserva
      transaction.set(reservationRef, {
        userId: user.uid,
        classId: cls.id,
        classType: cls.type,
        classTitle: cls.title,
        dateTime: cls.dateTime,
        createdAt: serverTimestamp(),
        status: "active",
        paymentMethod: paymentMethod // Guardar método para cancelaciones
      });

      // Actualizar clase: capacityLeft y attendees
      
      transaction.update(classRef, {
        capacityLeft: capacityLeft - 1,
        atendees: arrayUnion(user.uid),
      });

      // Actualizar usuario
      transaction.update(userRef, {
        ...updatedUserData,
        updatedAt: serverTimestamp()
      });
    });

    return { success: true };
  } catch (err) {
    console.error("Error haciendo reserva:", err);
    throw err;
  }
}

/**
 * Cancela una reserva usando transacción
 */
export async function cancelReservation(reservationId, user) {
  if (!user) throw new Error("Debes iniciar sesión para cancelar la reserva");

  const resRef = doc(db, "reservations", reservationId);

  try {
    await runTransaction(db, async (transaction) => {
      const resSnap = await transaction.get(resRef);
      if (!resSnap.exists()) throw new Error("Reserva no encontrada");

      const reservation = resSnap.data();
      if (reservation.userId !== user.uid) throw new Error("Solo puedes cancelar tus propias reservas");
      if (reservation.status === "cancelled") throw new Error("Esta reserva ya ha sido cancelada");

      // Obtener datos de la clase
      const classRef = doc(db, "classes", reservation.classId);
      const classSnap = await transaction.get(classRef);
      if (!classSnap.exists()) throw new Error("Clase asociada a la reserva no encontrada");
      const classData = classSnap.data();

      // Verificar tiempo de cancelación
      const classTime = classData.dateTime.toDate();
      const now = new Date();
      if (classTime - now < 2 * 60 * 60 * 1000) {
        throw new Error("No puedes cancelar la reserva menos de 2 horas antes de la clase");
      }

      // Obtener datos del usuario
      const userRef = doc(db, "users", user.uid);
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw new Error("Usuario no encontrado");
      const userData = userSnap.data();

      // Devolver clase o crédito según cómo se pagó
      const hasActiveSubscription = userData.subscription && 
        (userData.subscription.status === 'active' || userData.subscription.status === 'trialing');
      const paymentMethod = reservation.paymentMethod || 'subscription'; // fallback para reservas antiguas
      const classType = reservation.classType.toLowerCase();

      let updatedUserData = { ...userData };

      if (paymentMethod === 'subscription' && hasActiveSubscription) {
        // Devolver a la suscripción si sigue activa
        if (!updatedUserData.subscription.classesLeftThisPeriod[classType]) {
          updatedUserData.subscription.classesLeftThisPeriod[classType] = 0;
        }
        updatedUserData.subscription.classesLeftThisPeriod[classType]++;
      } else {
        // Devolver como crédito (si no tiene suscripción o se pagó con créditos)
        updatedUserData.classCredits = (updatedUserData.classCredits || 0) + 1;
        updatedUserData.hasClassCredits = true;
      }

      // Actualizar reserva (soft delete)
      transaction.update(resRef, { 
        status: "cancelled",
        cancelledAt: serverTimestamp()
      });

      // Actualizar clase: capacityLeft y attendees
      const currentCapacityLeft = classData.capacityLeft ?? 
        (classData.capacity - (classData.atendees?.length || 0));
      
      transaction.update(classRef, {
        capacityLeft: currentCapacityLeft + 1,
        atendees: arrayRemove(user.uid),
      });

      // Actualizar usuario
      transaction.update(userRef, {
        ...updatedUserData,
        updatedAt: serverTimestamp()
      });
    });

    return true;
  } catch (err) {
    console.error("Error cancelando reserva:", err);
    throw err;
  }
}

/**
 * Obtiene las reservas activas de un usuario
 */
export async function getUserReservations(userId) {
  const q = query(
    collection(db, "reservations"),
    where("userId", "==", userId),
    where("status", "==", "active")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}