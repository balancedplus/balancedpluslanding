'use client';

import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { useToast } from '../../components/ToastProvider';

export default function MiPerfil() {
  const { user, isVerified, getFullUserData, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [error, setError] = useState('');
  const { showInfo } = useToast();

  const handleResend = async () => {
    if (!user) return;

    setSendingEmail(true);
    try {
      await user.sendEmailVerification();
      showInfo("Correo de verificación reenviado. Revisa tu bandeja de entrada.");
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setSendingEmail(false);
    }
  };


  useEffect(() => {
    if (!user || !isVerified) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getFullUserData()
      .then((data) => setUserData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user, getFullUserData]);

    if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 md:px-0 flex flex-col items-center text-center">
        <p style={{ color: 'rgb(173, 173, 174)' }}>
          Debes iniciar sesión para ver tu perfil.
        </p>
        <Link
          href="/login"
          className="mt-4 px-6 py-2 rounded-md font-medium transition"
          style={{ backgroundColor: '#cbc8bf', color: '#fff' }}
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 md:px-0 flex flex-col items-center text-center">
        <h1 className="text-3xl mb-6" style={{ color: "rgb(173, 173, 174)" }}>
          ¡Casi listo!
        </h1>
        <p style={{ color: "rgb(173, 173, 174)" }}>
          Por favor, verifica tu correo antes de poder acceder a tu perfil y reservas.
        </p>
        <p className="mt-2 mb-6" style={{ color: "rgb(173, 173, 174)" }}>
          Si no recibiste el correo, revisa tu carpeta de spam o haz clic en el botón de abajo para reenviarlo.
        </p>
        <button
          onClick={handleResend} // tu función para reenviar el email
          disabled={sendingEmail} // estado que controlas
          className="px-6 py-2 rounded-full transition-all duration-300"
          style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
        >
          {sendingEmail ? "Enviando..." : "Reenviar correo de verificación"}
        </button>
      </div>
    );
  }


  if (loading || !userData) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 md:px-0 text-center">
        <p style={{ color: 'rgb(173, 173, 174)' }}>Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 md:px-0 flex flex-col gap-6 items-center text-center">
      <h1 className="text-3xl" style={{ color: 'rgb(173, 173, 174)' }}>
        Hola, {userData.name}
      </h1>
      <p className="text-center mb-8" style={{ color: "rgb(173, 173, 174)" }}>
        Aquí puedes ver y gestionar tu perfil.
      </p>

      <div className="flex flex-col gap-4 md:gap-6 w-full">
        {/* Reservas */}
        <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#cbc8bf' }}>
          <h2 className="text-xl mb-2" style={{ color: '#fff' }}>Tus reservas</h2>
          <p className="text-sm mb-4" style={{ color: '#fff' }}>
            Visualiza todas tus reservas futuras.
          </p>
          <Link
            href="/misReservas"
            className="px-4 py-2 rounded-md transition inline-block"
            style={{ backgroundColor: '#fff', color: 'rgb(173, 173, 174)' }}
          >
            Ver mis reservas
          </Link>
        </div>

        {/* Placeholder para futuros datos del plan */}
        <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#cbc8bf' }}>
          <h2 className="text-xl mb-2" style={{ color: '#fff' }}>Tu plan</h2>
          <p className="text-sm" style={{ color: '#fff' }}>
            Próximamente podrás ver tu plan, clases restantes y suscripción mensual aquí.
          </p>
        </div>

          {userData.role === 'admin' && (
          <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#cbc8bf' }}>
            <h2 className="text-xl mb-2" style={{ color: '#fff' }}>Panel de administración</h2>
            <p className="text-sm mb-4" style={{ color: '#fff' }}>
              Accede al dashboard de administración.
            </p>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-md transition inline-block"
              style={{ backgroundColor: '#fff', color: 'rgb(173, 173, 174)' }}
            >
              Ir al panel
            </Link>
          </div>
          )}


         <button
            onClick={logout}
            className="mt-8 px-6 py-2 rounded-md font-medium transition"
            style={{ backgroundColor: '#cbc8bf', color: '#fff' }}
          >
            Cerrar sesión
        </button>
      </div>
    </div>
  );
}
