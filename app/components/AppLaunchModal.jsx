'use client';

import { useState, useEffect } from 'react';
import { X, Smartphone, Apple, Download, Sparkles, Calendar, Bell, Zap } from 'lucide-react';

export default function AppLaunchModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si ya se cerró en esta sesión
    const hasClosedInSession = sessionStorage.getItem('appLaunchModalClosed');
    
    // Verificar si viene del modal (parámetro en URL)
    const urlParams = new URLSearchParams(window.location.search);
    const fromModal = urlParams.get('from') === 'modal';
    
    if (!hasClosedInSession && !fromModal) {
      // Mostrar modal después de 1.5 segundos solo si no se ha cerrado
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else if (fromModal) {
      // Si viene del modal, marcar como cerrado para esta sesión
      sessionStorage.setItem('appLaunchModalClosed', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Guardar en sessionStorage que se cerró (dura hasta cerrar navegador)
    sessionStorage.setItem('appLaunchModalClosed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pointer-events-none">
        <div 
          className="relative w-full max-w-md bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl animate-slideUp pointer-events-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#cbc8bf]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#cbc8bf]/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 rounded-full transition-all z-10 bg-white/80 hover:bg-white shadow-lg"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-[rgb(173,173,174)]" />
          </button>

          {/* Contenido */}
          <div className="relative p-5 sm:p-6">
            {/* Icono principal con animación */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-[#cbc8bf] rounded-3xl blur-xl opacity-50 animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#cbc8bf] to-[#ada9a0] shadow-xl">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                {/* Sparkles decorativos */}
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-[#cbc8bf] animate-bounce" />
              </div>
            </div>

            {/* Badge animado */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#cbc8bf] to-[#ada9a0] text-white font-light text-xs rounded-full uppercase tracking-wider shadow-lg animate-shimmer">
                <Zap className="w-3.5 h-3.5" />
                Nueva App
              </span>
            </div>

            {/* Título con gradiente */}
            <h2 className="text-2xl sm:text-3xl font-light mb-3 text-center bg-gradient-to-r from-[#cbc8bf] to-[#ada9a0] bg-clip-text text-transparent">
              ¡Descarga nuestra app!
            </h2>
            
            <p className="text-base mb-5 text-center font-light text-[rgb(100,100,100)] px-2">
              Reserva tus clases desde cualquier lugar
            </p>

            {/* Features con iconos */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/60 backdrop-blur">
                <div className="w-10 h-10 rounded-full bg-[#cbc8bf]/20 flex items-center justify-center mb-1.5">
                  <Calendar className="w-5 h-5 text-[#cbc8bf]" />
                </div>
                <p className="text-xs font-light text-[rgb(100,100,100)]">Reservas fáciles</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/60 backdrop-blur">
                <div className="w-10 h-10 rounded-full bg-[#cbc8bf]/20 flex items-center justify-center mb-1.5">
                  <Bell className="w-5 h-5 text-[#cbc8bf]" />
                </div>
                <p className="text-xs font-light text-[rgb(100,100,100)]">Notificaciones</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/60 backdrop-blur">
                <div className="w-10 h-10 rounded-full bg-[#cbc8bf]/20 flex items-center justify-center mb-1.5">
                  <Zap className="w-5 h-5 text-[#cbc8bf]" />
                </div>
                <p className="text-xs font-light text-[rgb(100,100,100)]">Acceso rápido</p>
              </div>
            </div>

            {/* Botones de descarga grandes */}
            <div className="space-y-2.5 mb-4">
              
              <a  href="https://apps.apple.com/es/app/balanced-plus/id6754761355"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-2xl font-light transition-all hover:scale-105 text-sm bg-gradient-to-r from-[#cbc8bf] to-[#ada9a0] text-white shadow-lg hover:shadow-xl"
                >
                <Apple className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Descargar en App Store</span>
              </a>

              
               <a href="https://play.google.com/store/apps/details?id=com.zuinqstudio.ismygym.balanced&hl=es_419"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-2xl font-light transition-all hover:scale-105 text-sm bg-gradient-to-r from-[#cbc8bf] to-[#ada9a0] text-white shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Descargar en Google Play</span>
              </a>
            </div>

            {/* Botón cerrar discreto */}
            <button
              onClick={handleClose}
              className="w-full px-6 py-2.5 rounded-2xl font-light transition-all text-xs bg-white/50 hover:bg-white/80 text-[rgb(173,173,174)]"
            >
              Recordarme más tarde
            </button>

            <p className="text-xs mt-4 text-center font-light text-[rgb(150,150,150)]">
              📱 iOS 13+ y Android 8+
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}