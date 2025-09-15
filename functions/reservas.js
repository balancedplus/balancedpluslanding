// functions/reservas.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore"); //

const db = admin.firestore();

/**
 * Crea una reserva de clase para un usuario
 * @param {Object} data - { userId, clsId }
 */
exports.makeReservation = functions.https.onCall(async (data, context) => {
  
  const { userId, clsId } = data.data || data;
  console.log("Después destructuring - userId:", userId, "clsId:", clsId);

  console.log("Recibidos userId y clsId en el back - " + userId + " - " + clsId)

  if (!userId || !clsId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Faltan datos requeridos para reservar"
    );
  }

  const classRef = db.collection("classes").doc(clsId);
  const userRef = db.collection("users").doc(userId);
  const reservationRef = db.collection("reservations").doc(`${clsId}_${userId}`);

  try {
    await db.runTransaction(async (t) => {
      // Obtener usuario
      const userSnap = await t.get(userRef);
      if (!userSnap.exists) throw new functions.https.HttpsError("not-found", "Usuario no encontrado");
      const userData = userSnap.data();
      const userName = userData.displayName || `${userData.name || ""} ${userData.surname || ""}`.trim();

      // Comprobar si ya existe reserva
      const reservationSnap = await t.get(reservationRef);
      if (reservationSnap.exists && reservationSnap.data().status === "active") {
        throw new functions.https.HttpsError(
          "already-exists",
          "Ya tienes una reserva activa para esta clase"
        );
      }

      // Obtener clase
      const classSnap = await t.get(classRef);
      if (!classSnap.exists) throw new functions.https.HttpsError("not-found", "Clase no encontrada");
      const classData = classSnap.data();
      const capacityLeft =
        typeof classData.capacityLeft === "number"
          ? classData.capacityLeft
          : classData.capacity != null
          ? Math.max(0, classData.capacity - (classData.atendees?.length || 0))
          : 0;

      if (capacityLeft <= 0) {
        throw new functions.https.HttpsError("failed-precondition", "No quedan plazas disponibles");
      }

      // Crear la reserva incluyendo nombre completo y title
      t.set(reservationRef, {
        userId,
        userName,           // <-- nombre completo del usuario
        classId: clsId,
        classType: classData.type,
        classTitle: classData.title, // <-- título de la clase
        dateTime: classData.dateTime,
        createdAt: FieldValue.serverTimestamp(),
        status: "active",
      });

      // Actualizar clase: capacityLeft y attendees
      t.update(classRef, {
        capacityLeft: capacityLeft - 1,
        atendees: FieldValue.arrayUnion(userId),
      });
    });

    return { success: true };
  } catch (err) {
    console.error("Error haciendo reserva:", err);
    if (err instanceof functions.https.HttpsError) throw err;
    throw new functions.https.HttpsError("internal", err.message);
  }
});

/**
 * Cancela una reserva existente
 * @param {Object} data - { reservationId, userId }
 */
exports.cancelReservation = functions.https.onCall(async (data, context) => {
  const { reservationId, userId } = data.data || data;

  

  if (!reservationId || !userId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Faltan datos requeridos para cancelar la reserva"
    );
  }

  const resRef = db.collection("reservations").doc(reservationId);

  try {
    await db.runTransaction(async (t) => {
      const resSnap = await t.get(resRef);
      if (!resSnap.exists) throw new functions.https.HttpsError("not-found", "Reserva no encontrada");

      const reservation = resSnap.data();
      if (reservation.userId !== userId) throw new functions.https.HttpsError("permission-denied", "Solo puedes cancelar tus propias reservas");
      if (reservation.status === "cancelled") throw new functions.https.HttpsError("failed-precondition", "Esta reserva ya ha sido cancelada");

      const classRef = db.collection("classes").doc(reservation.classId);
      const classSnap = await t.get(classRef);
      if (!classSnap.exists) throw new functions.https.HttpsError("not-found", "Clase asociada a la reserva no encontrada");

      const classData = classSnap.data();
      const classTime = classData.dateTime.toDate ? classData.dateTime.toDate() : new Date(classData.dateTime);
      const now = new Date();
      if (classTime - now < 2 * 60 * 60 * 1000) {
        throw new functions.https.HttpsError("failed-precondition", "No puedes cancelar la reserva menos de 2 horas antes de la clase");
      }

      // Actualizar reserva (soft delete)
      t.update(resRef, { status: "cancelled" });

      // Actualizar clase: capacityLeft y attendees
      t.update(classRef, {
        capacityLeft: (classData.capacityLeft ?? (classData.capacity - (classData.atendees?.length || 0))) + 1,
        atendees: FieldValue.arrayRemove(userId),
      });
    });

    return { success: true };
  } catch (err) {
    console.error("Error cancelando reserva:", err);
    if (err instanceof functions.https.HttpsError) throw err;
    throw new functions.https.HttpsError("internal", err.message);
  }
});

/**
 * Obtiene las reservas activas de un usuario con fecha futura
 * @param {Object} data - { userId }
 */
exports.getUserReservations = functions.https.onCall(async (data, context) => {
  const { userId } = data;

  if (!userId) {
    throw new functions.https.HttpsError("invalid-argument", "Faltan datos requeridos para obtener reservas");
  }

  try {
    const now = admin.firestore.Timestamp.now();

    const reservationsSnap = await db
      .collection("reservations")
      .where("userId", "==", userId)
      .where("status", "==", "active")
      .where("dateTime", ">", now)
      .get();

    const reservations = reservationsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return { reservations };
  } catch (err) {
    console.error("Error obteniendo reservas:", err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});
