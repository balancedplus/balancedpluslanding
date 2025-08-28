// app/api/subscribe/route.js
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const { nombre, apellidos, telefono, email } = await request.json();

    // Validación básica
    if (!nombre || !apellidos || !telefono || !email) {
      return new Response(JSON.stringify({ ok: false, error: "Todos los campos son obligatorios" }), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Email inválido" }), { status: 400 });
    }

    // Guardar en Firestore en la colección open_day_reservations
    await addDoc(collection(db, "open_day_reservations"), {
      name: nombre,
      surname: apellidos,
      phoneNumber: telefono,
      email,
      createdAt: serverTimestamp(),
    });


    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
