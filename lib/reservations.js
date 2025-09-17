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

      // Comprobar plazas disponibles
      const classSnap = await transaction.get(classRef);
      if (!classSnap.exists()) throw new Error("Clase no encontrada");
      const classData = classSnap.data();
      const capacityLeft =
        typeof classData.capacityLeft === "number"
          ? classData.capacityLeft
          : classData.capacity != null
          ? Math.max(0, classData.capacity - (classData.atendees?.length || 0))
          : 0;

      if (capacityLeft <= 0) throw new Error("No quedan plazas disponibles");

      // Comprobar clases restantes del usuario
      /*
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw new Error("Usuario no encontrado");
      const userData = userSnap.data();
      const field = `classesLeftThisPeriod.${cls.type.toLowerCase()}`;
      if ((userData.classesLeftThisPeriod?.[cls.type.toLowerCase()] ?? 0) <= 0) {
        throw new Error(`No te quedan clases disponibles de tipo ${cls.type}`);
      }
      */
      // Crear la reserva
      transaction.set(reservationRef, {
        userId: user.uid,
        classId: cls.id,
        classType: cls.type,
        classTitle: cls.title,
        dateTime: cls.dateTime,
        createdAt: serverTimestamp(),
        status: "active",
      });

      // Actualizar clase: capacityLeft y attendees
      transaction.update(classRef, {
        capacityLeft: capacityLeft - 1,
        atendees: arrayUnion(user.uid),
      });

      // Actualizar usuario: decrementar clases disponibles
      /*
      transaction.update(userRef, {
        [field]: (userData.classesLeftThisPeriod?.[cls.type.toLowerCase()] ?? 0) - 1,
      });
      */
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

      const classRef = doc(db, "classes", reservation.classId);
      const classSnap = await transaction.get(classRef);
      if (!classSnap.exists()) throw new Error("Clase asociada a la reserva no encontrada");
      const classData = classSnap.data();

      const classTime = classData.dateTime.toDate();
      const now = new Date();
      if (classTime - now < 2 * 60 * 60 * 1000) {
        throw new Error("No puedes cancelar la reserva menos de 2 horas antes de la clase");
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw new Error("Usuario no encontrado");

      //const field = `classesLeftThisPeriod.${reservation.classType.toLowerCase()}`;

      // Actualizar reserva (soft delete)
      transaction.update(resRef, { status: "cancelled" });

      // Actualizar clase: capacityLeft y attendees
      transaction.update(classRef, {
        capacityLeft: (classData.capacityLeft ?? (classData.capacity - (classData.atendees?.length || 0))) + 1,
        atendees: arrayRemove(user.uid),
      });

      // Actualizar usuario: incrementar clases disponibles
      /*
      transaction.update(userRef, {
        [field]: (userSnap.data().classesLeftThisPeriod?.[reservation.classType.toLowerCase()] ?? 0) + 1,
      });
      */
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