'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password });
      setSuccess(`Bienvenido, ${res.user.displayName || res.user.email}`);
      router.push("/miPerfil");
    } catch (err) {
      console.error("Error login:", err.message);
      setError(getErrorMessage(err));
    }
  };

  // Clase para inputs con borde fino y efecto de levantar
  const floatClass =
    "w-full rounded-md p-3 placeholder-gray-400 bg-white border border-gray-300 transition-all duration-300 ease-in-out focus:outline-none focus:shadow-md focus:-translate-y-1";

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 flex flex-col items-center">
      <h1 className="text-3xl text-center mb-4" style={{ color: "rgb(173, 173, 174)" }}>
        Iniciar sesión
      </h1>
      <p className="text-center mb-8" style={{ color: "rgb(173, 173, 174)" }}>
        Accede a tu cuenta para disfrutar de todas nuestras clases y beneficios
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={floatClass}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={floatClass}
          required
        />

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <button
          type="submit"
          className="rounded-md py-2 mt-4 text-lg transition-all duration-300"
          style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
        >
          Entrar
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "rgb(173, 173, 174)" }}>
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
