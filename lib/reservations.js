// lib/reservations.js
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// Llamada backend para crear reserva
export async function makeReservation({ user, cls }) {

  const userId = user?.uid;
  const clsId = cls?.id;


    console.log("user recibido:", user);
  console.log("cls recibido:", cls);
  console.log("user.uid:", user.uid);
  console.log("cls.id:", cls.id);


  const functions = getFunctions();
  const fn = httpsCallable(functions, "makeReservation");

  const payload = { userId, clsId };
  console.log("Payload final:", payload);
  
  const res = await fn({ userId: user.uid, clsId: cls.id });
  return res.data;
}

// Llamada backend para cancelar reserva
export async function cancelReservation(reservationId, user) {
  const functions = getFunctions();
  const fn = httpsCallable(functions, "cancelReservation");
  const res = await fn({ reservationId, userId: user.uid });
  return res.data;
}

// Llamada backend para obtener reservas futuras de un usuario
export async function getUserReservations(userId) {
  const functions = getFunctions();
  const fn = httpsCallable(functions, "getUserReservations");
  const res = await fn({ userId });
  return res.data.reservations || [];
}


export function subscribeUserReservations(userId, onData, onError) {
  const q = query(
    collection(db, "reservations"),
    where("userId", "==", userId),
    where("status", "==", "active")
  );
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData(list);
  }, onError);
}
