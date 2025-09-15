'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import Link from "next/link";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Button } from "../../../components/ui/button";
// shadcn/ui
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";


// Framer Motion
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);

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

  const handleResetPassword = async () => {
    if (!email) {
      setError("Por favor, introduce tu correo electrónico primero.");
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setShowConfirmation(false);
      setShowEmailSent(true);
      setError("");
    } catch (err) {
      console.error("Error reset password:", err.message);
      setError(getErrorMessage(err));
    }
  };

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
        {success && <p className="text-sm text-center text-green-500">{success}</p>}

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

      {/* AlertDialog de shadcn para confirmar envío */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogTrigger asChild>
          <button
            className="mt-4 underline text-sm"
            type="button"
            onClick={() => setShowConfirmation(true)}
            style={{ color: "rgb(173, 173, 174)" }}
          >
            ¿Has olvidado la contraseña?
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restablecer contraseña</AlertDialogTitle>
            <AlertDialogDescription>
              Se enviará un correo para restablecer tu contraseña. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </Button>
            <Button
              style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
              onClick={handleResetPassword}
            >
              Enviar correo
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal fade-in/fade-out usando Framer Motion */}
      <AnimatePresence>
        {showEmailSent && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-8 max-w-sm text-center shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: "rgb(173, 173, 174)" }}>
                Correo enviado
              </h2>
              <p className="mb-6" style={{ color: "rgb(173, 173, 174)" }}>
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <Button
                style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
                onClick={() => setShowEmailSent(false)}
              >
                Volver al login
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
