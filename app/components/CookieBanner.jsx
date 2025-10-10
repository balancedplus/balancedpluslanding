// app/components/CookieBanner.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó las cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      // Mostrar el banner después de 1 segundo
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

    const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    
    // Activar Google Analytics mediante Consent Mode
    if (window.gtag) {
        window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
        });
    }
    
    setShowBanner(false);
    };

    const rejectCookies = () => {
    localStorage.setItem('cookiesAccepted', 'essential');
    
    // Mantener Analytics desactivado (ya está denegado por defecto)
    if (window.gtag) {
        window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
        });
    }
    
    setShowBanner(false);
    };

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up"
      style={{ backgroundColor: 'rgba(203, 200, 191, 0.98)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Texto */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm md:text-base text-white font-light">
            Utilizamos cookies propias y de terceros para mejorar tu experiencia. 
            Al continuar navegando, aceptas nuestra{' '}
            <Link href="/cookies" className="underline hover:opacity-70">
              Política de Cookies
            </Link>.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm font-light rounded-full transition-all duration-300 hover:opacity-80"
            style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff' }}
          >
            Solo esenciales
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 text-sm font-light rounded-full transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: '#fff', color: 'rgb(173, 173, 174)' }}
          >
            Aceptar todas
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}