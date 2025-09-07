"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebase";
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
      const res = await login({ email, password }); // <-- aquí
      setSuccess(`Bienvenido, ${res.user.displayName || res.user.email}`);
      router.push("/miPerfil");
    } catch (err) {
      console.error("Error login:", err.message);
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 sm:px-6 md:px-0 flex flex-col items-center">
      <h1 className="text-3xl text-center mb-6" style={{ color: "rgb(173, 173, 174)" }}>
        Iniciar sesión
      </h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full rounded-md p-3"
          style={{ color: 'rgb(173, 173, 174)', borderColor: 'rgb(173, 173, 174)', borderWidth: '.5px' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full rounded-md p-3"
          style={{ color: 'rgb(173, 173, 174)', borderColor: 'rgb(173, 173, 174)', borderWidth: '0.5px' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-center" style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          className="rounded-md py-2 mt-4 text-lg transition"
          style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
        >
          Entrar
        </button>
      </form>

        <p className="mt-6 text-center text-sm" style={{ color: "rgb(173, 173, 174)" }}>
            ¿No tienes cuenta?{" "}
            <Link
                href="/register"
                className="font-medium"
                >
                Regístrate aquí
            </Link>
      </p>

    </div>
  );
}
