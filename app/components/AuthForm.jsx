"use client";

import { useState } from "react";
import { auth } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function AuthForm({ mode = "login" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 sm:px-6 md:px-0 flex flex-col items-center">
      <h1
        className="text-3xl text-center mb-6"
        style={{ color: "rgb(173, 173, 174)" }}
      >
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full rounded-md p-3"
          style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full rounded-md p-3"
          style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-center" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="rounded-md py-2 mt-4 text-lg font-medium transition"
          style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
        >
          {isRegister ? "Registrarse" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
