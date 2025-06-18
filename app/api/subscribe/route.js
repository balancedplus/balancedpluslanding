// app/api/subscribe/route.js
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  const { email } = await request.json();

  // Validación básica
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "Email inválido" }), { status: 400 });
  }

  try {
    await addDoc(collection(db, "newsletter_subscribers"), {
      email,
      subscribedAt: serverTimestamp(),
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
