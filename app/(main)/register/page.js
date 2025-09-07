'use client';

import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useToast } from "../../components/ToastProvider";

export default function RegisterPage() {
  const { register, resendVerificationEmail } = useAuth();
  const { showInfo } = useToast();
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    birthDate: "",
    gender: "",
    phoneNumber: "",
    zipCode: "",
  });

  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("handleSubmit llamado", form.email, new Date().toISOString());
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(6|7|8|9)\d{8}$/;
    const zipRegex = /^(0[1-9]|[1-4][0-9]|5[0-2])\d{3}$/;

    if (!emailRegex.test(form.email)) {
      setError("El correo electrónico no es válido.");
      return;
    }

    if (!phoneRegex.test(form.phoneNumber)) {
      setError("El número de teléfono no es válido.");
      return;
    }

    if (!zipRegex.test(form.zipCode)) {
      setError("El código postal no es válido.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register(form);
      setRegistered(true);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    }
  };

  const handleResend = async () => {
    setSendingEmail(true);
    try {
      await resendVerificationEmail();
      showInfo("Correo de verificación reenviado. Revisa tu bandeja de entrada.");
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setSendingEmail(false);
    }
  };

  if (registered) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-4 flex flex-col items-center text-center">
        <h1 className="text-3xl mb-6" style={{ color: "rgb(173, 173, 174)" }}>¡Casi listo!</h1>
        <p style={{ color: "rgb(173, 173, 174)" }}>
          Hemos enviado un correo de verificación a <strong>{form.email}</strong>.
        </p>
        <p className="mt-2 mb-6" style={{ color: "rgb(173, 173, 174)" }}>
          Por favor, verifica tu cuenta antes de poder acceder a tu perfil y reservas.
        </p>
        <button
          onClick={handleResend}
          disabled={sendingEmail}
          className="px-6 py-2 rounded-full transition-all duration-300"
          style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
        >
          {sendingEmail ? "Enviando..." : "Reenviar correo de verificación"}
        </button>
      </div>
    );
  }

  // Clase para inputs con borde fino y efecto de levantar
  const floatClass =
    "w-full rounded-md p-3 placeholder-gray-400 bg-white border border-gray-300 transition-all duration-300 ease-in-out focus:outline-none focus:shadow-md focus:-translate-y-1";

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 flex flex-col items-center">
      <h1 className="text-3xl text-center mb-6" style={{ color: "rgb(173, 173, 174)" }}>Crear cuenta</h1>
      <p className="text-center mb-8" style={{ color: "rgb(173, 173, 174)" }}>
        Únete a Balanced+ y disfruta de Pilates, Yoga, Barre y Entrenamiento Funcional
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

        <input
          type="text"
          name="name"
          placeholder="* Nombre"
          value={form.name}
          onChange={handleChange}
          className={floatClass}
          required
        />

        <input
          type="text"
          name="surname"
          placeholder="* Apellido"
          value={form.surname}
          onChange={handleChange}
          className={floatClass}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="* Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className={floatClass}
          required
        />

        {/* Fila Contraseña / Confirmar */}
        <div className="flex gap-4">
          <input
            type="password"
            name="password"
            placeholder="* Contraseña"
            value={form.password}
            onChange={handleChange}
            className={floatClass + " flex-1"}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="* Repetir contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            className={floatClass + " flex-1"}
            required
          />
        </div>

        {/* Fila Fecha / Género */}
        <div className="flex gap-4">
          <input
            type={form.birthDate ? "date" : "text"}
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            placeholder="Fecha de nacimiento (opcional)"
            className={floatClass + " flex-1"}
            />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={floatClass + " flex-1"}
          >
            <option value="" disabled>Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Fila Teléfono / Código postal */}
        <div className="flex gap-4">
          <input
            type="text"
            name="phoneNumber"
            placeholder="* Teléfono"
            value={form.phoneNumber}
            onChange={handleChange}
            className={floatClass + " flex-1"}
            required
          />
          <input
            type="text"
            name="zipCode"
            placeholder="* Código postal" 
            value={form.zipCode}
            onChange={handleChange}
            className={floatClass + " flex-1"}
            required
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
        Los campos marcados con * son obligatorios.
        </p>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <button
          type="submit"
          className="rounded-md py-2 mt-4 text-lg transition-all duration-300"
          style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
