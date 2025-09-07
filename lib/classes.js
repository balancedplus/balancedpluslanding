// lib/classes.js
import { db } from "./firebase";
import { collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { dayBoundsFromInput } from "./dates";

// Suscripción en tiempo real a las clases de un día
export function subscribeClassesByDay(dateStr, onData, onError) {
  const { start, end } = dayBoundsFromInput(dateStr);
  const q = query(
    collection(db, "classes"),
    where("dateTime", ">=", start),
    where("dateTime", "<", end),
    orderBy("dateTime")
  );

  return onSnapshot(
    q,
    (snap) => {
      const now = new Date();
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter(c => c.dateTime?.toDate() >= now); // solo futuras
      onData(list);
    },
    onError
  );
}


// (Opcional) lectura puntual sin tiempo real
export async function getClassesByDay(dateStr) {
  const { start, end } = dayBoundsFromInput(dateStr);
  const q = query(
    collection(db, "classes"),
    where("dateTime", ">=", start),
    where("dateTime", "<", end),
    orderBy("dateTime")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
