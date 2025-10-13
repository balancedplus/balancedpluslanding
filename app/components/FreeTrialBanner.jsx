'use client';

import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

export default function FreeTrialBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  const phoneNumber = "34678528165"; // Cambia por tu número real
  const message = "Hola, me gustaría probar una clase gratis";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (!isVisible) return null;

  return (
    <div 
      className="relative w-full py-4 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="max-w-7xl mx-auto mt-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Contenido principal */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-white/20 flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-base sm:text-lg">
                Clase de Prueba Gratuita
              </p>
              <p className="text-white/90 text-sm sm:text-base">
                Prueba cualquier clase sin compromiso
              </p>
            </div>
          </div>

          {/* Botón de WhatsApp */}
          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#000000] rounded-full font-medium hover:bg-white/90 transition-all shadow-sm hover:shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Escríbenos</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            
            {/* Botón cerrar */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Cerrar banner"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}