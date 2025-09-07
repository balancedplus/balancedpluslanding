'use client';

import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MiPerfil() {
  const { user, isVerified, getFullUserData, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

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

  if (!user || !isVerified) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 md:px-0 flex flex-col items-center text-center">
        <p style={{ color: 'rgb(173, 173, 174)' }}>Debes iniciar sesión y verificar tu correo para ver tu perfil.</p>
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
