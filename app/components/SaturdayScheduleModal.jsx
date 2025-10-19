'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

export default function SaturdayScheduleModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si ya se cerró en esta sesión
    const hasClosedInSession = sessionStorage.getItem('saturdayScheduleClosed');
    
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
      sessionStorage.setItem('saturdayScheduleClosed', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Guardar en sessionStorage que se cerró (dura hasta cerrar navegador)
    sessionStorage.setItem('saturdayScheduleClosed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-slideUp pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10"
            style={{ backgroundColor: 'rgba(203, 200, 191, 0.2)' }}
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" style={{ color: 'rgb(173, 173, 174)' }} />
          </button>

          {/* Contenido */}
          <div className="p-8 text-center">
            {/* Icono */}
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{ backgroundColor: '#cbc8bf' }}
            >
              <Calendar className="w-8 h-8 text-white" />
            </div>

            {/* Título */}
            <h2 className="text-3xl font-light mb-3" style={{ color: 'rgb(173, 173, 174)' }}>
              Nuevos Horarios
            </h2>
            
            <p className="text-lg mb-8" style={{ color: 'rgb(100, 100, 100)' }}>
              Ampliamos nuestras clases los sábados
            </p>

            {/* Horarios */}
            <div className="space-y-4 mb-8">
              <div className="rounded-xl p-4" style={{ backgroundColor: '#cbc8bf' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-white" />
                  <p className="text-white font-medium text-lg">
                    Entrenamiento Funcional
                  </p>
                </div>
                <p className="text-white/95">
                  9:00 - 10:00 y 10:00 - 11:00
                </p>
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: '#cbc8bf' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-white" />
                  <p className="text-white font-medium text-lg">
                    Barre
                  </p>
                </div>
                <p className="text-white/95">
                  11:00 - 12:00
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/reservas?from=modal"
                className="flex-1 px-6 py-3 rounded-full font-medium transition-all hover:shadow-md text-center"
                style={{ backgroundColor: '#cbc8bf', color: 'white' }}
              >
                Reservar Clases
              </a>
              
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 rounded-full font-medium transition-all"
                style={{ backgroundColor: '#cbc8bf', color: 'white' }}
              >
                Entendido
              </button>
            </div>

            <p className="text-sm mt-6" style={{ color: 'rgb(150, 150, 150)' }}>
              Disponibles a partir del sábado 25 de octubre
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
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}