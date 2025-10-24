'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Copy, Check } from 'lucide-react';

export default function OctoberPromoModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Verificar si ya se cerró en esta sesión
    const hasClosedInSession = sessionStorage.getItem('octoberPromoClosed');
    
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
      sessionStorage.setItem('octoberPromoClosed', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Guardar en sessionStorage que se cerró (dura hasta cerrar navegador)
    sessionStorage.setItem('octoberPromoClosed', 'true');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('FINOCTUBREGRATIS');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-slideUp pointer-events-auto mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full transition-colors z-10"
            style={{ backgroundColor: 'rgba(203, 200, 191, 0.2)' }}
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" style={{ color: 'rgb(173, 173, 174)' }} />
          </button>

          {/* Contenido */}
          <div className="p-6 sm:p-8 text-center">
            {/* Icono */}
            <div 
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6"
              style={{ backgroundColor: '#cbc8bf' }}
            >
              <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>

            {/* Título */}
            <h2 className="text-2xl sm:text-3xl font-light mb-3" style={{ color: 'rgb(173, 173, 174)' }}>
              ¡Oferta Especial!
            </h2>
            
            <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: 'rgb(100, 100, 100)' }}>
              Última semana de octubre gratis al suscribirte.
            </p>

            <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: 'rgb(100, 100, 100)' }}>
              Suscríbete ahora y no pagues hasta noviembre.
            </p>


            {/* Código */}
            <div className="mb-6 sm:mb-8">
              <div className="rounded-xl p-4 sm:p-5" style={{ backgroundColor: '#cbc8bf' }}>
                <p className="text-white/90 text-sm sm:text-base mb-3">
                  Usa este código al suscribirte:
                </p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <p className="text-white font-bold text-xl sm:text-2xl tracking-wider">
                    FINOCTUBREGRATIS
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full font-medium transition-all hover:shadow-md text-sm"
                  style={{ color: 'rgb(173, 173, 174)' }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar código
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/tarifas?from=modal"
                className="flex-1 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-medium transition-all hover:shadow-md text-center text-sm sm:text-base"
                style={{ backgroundColor: '#cbc8bf', color: 'white' }}
              >
                Ver Planes
              </a>
              
              <button
                onClick={handleClose}
                className="flex-1 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base"
                style={{ 
                  backgroundColor: 'rgba(203, 200, 191, 0.2)', 
                  color: 'rgb(173, 173, 174)' 
                }}
              >
                Entendido
              </button>
            </div>

            <p className="text-xs sm:text-sm mt-4 sm:mt-6" style={{ color: 'rgb(150, 150, 150)' }}>
              Oferta válida para nuevas suscripciones
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