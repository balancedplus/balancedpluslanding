'use client';

import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { useToast } from '../../components/ToastProvider';
import { getUserReservations } from '@/lib/reservations';

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

  if (loading || !userData) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 md:px-0 text-center">
        <p style={{ color: 'rgb(173, 173, 174)' }}>Cargando tu perfil...</p>
      </div>
    );
  }

  // Helper functions para obtener el nombre del plan
  const getPlanTitle = (planType) => {
    const planTitles = {
      'barre_4': 'Barre 4 x MES',
      'barre_8': 'Barre 8 x MES',
      'funcional_4': 'Funcional 4 x MES',
      'funcional_8': 'Funcional 8 x MES',
      'pilates_4': 'Pilates 4 x MES',
      'pilates_8': 'Pilates 8 x MES',
      'yoga_4': 'Yoga 4 x MES',
      'yoga_8': 'Yoga 8 x MES',
      'unlimited': 'Plan Ilimitado'
    };
    return planTitles[planType] || planType;
  };

  // Verificar si tiene suscripción activa
  const hasActiveSubscription = userData?.subscription && 
    (userData.subscription.status === 'active' || userData.subscription.status === 'trialing');
  
  const hasCredits = userData?.hasClassCredits && (userData.classCredits || 0) > 0;

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 md:px-0 flex flex-col gap-6 items-center text-center">
      <h1 className="text-3xl" style={{ color: 'rgb(173, 173, 174)' }}>
        Hola, {userData.name || 'Usuario'}
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

        {/* Tu plan */}
        <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#cbc8bf' }}>
          <h2 className="text-xl mb-4" style={{ color: '#fff' }}>Tu plan</h2>
          
          {hasActiveSubscription ? (
            <div className="space-y-4">
              {/* Información del plan */}
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(173, 173, 174)' }}>
                  {getPlanTitle(userData.subscription.planType)}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: 'rgb(173, 173, 174)' }} className="opacity-75">Estado:</span>
                    <span style={{ color: 'rgb(173, 173, 174)' }} className="ml-2">
                      {userData.subscription.status === 'active' ? 'Activo' : 
                       userData.subscription.status === 'trialing' ? 'Activo' : 
                       userData.subscription.status}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'rgb(173, 173, 174)' }} className="opacity-75">Modalidad:</span>
                    <span style={{ color: 'rgb(173, 173, 174)' }} className="ml-2">
                      {userData.subscription.reservationType === 'fixed' ? 'Horario fijo' : 'Flexible'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clases disponibles */}
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3" style={{ color: 'rgb(173, 173, 174)' }}>Clases disponibles este mes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {userData.subscription.classesLeftThisPeriod && 
                   Object.entries(userData.subscription.classesLeftThisPeriod).map(([type, count]) => (
                    <div key={type} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: 'rgb(173, 173, 174)' }}>
                        {count}
                      </div>
                      <div className="text-xs opacity-75 capitalize" style={{ color: 'rgb(173, 173, 174)' }}>
                        {type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : hasCredits ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(173, 173, 174)' }}>Créditos disponibles</h3>
              <div className="text-3xl font-bold" style={{ color: 'rgb(173, 173, 174)' }}>{userData.classCredits}</div>
              <div className="text-xs opacity-75" style={{ color: 'rgb(173, 173, 174)' }}>
                Crédito{userData.classCredits !== 1 ? 's' : ''} para cualquier clase
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-white mb-4">No tienes un plan activo</p>
              <Link
                href="/suscripciones"
                className="px-4 py-2 rounded-md transition inline-block"
                style={{ backgroundColor: '#fff', color: 'rgb(173, 173, 174)' }}
              >
                Ver planes disponibles
              </Link>
            </div>
          )}
        </div>

        {/* Panel de admin si es admin */}
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