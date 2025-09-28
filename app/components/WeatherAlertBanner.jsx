'use client';

import { useState } from 'react';
import { X, AlertTriangle, ExternalLink } from 'lucide-react';

export default function WeatherAlertBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-red-600 border-b border-red-700 relative mt-20">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-red-800">
              <AlertTriangle className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <div className="ml-3">
              <p className="font-medium text-white">
                <span className="md:hidden">
                  Aviso importante: El centro permanecerá cerrado el Lunes 29/09/2025 debido a la alerta roja por condiciones meteorológicas adversas. Todas las clases quedan canceladas por seguridad.
                </span>
                <span className="hidden md:inline">
                  Aviso importante: El centro permanecerá cerrado el Lunes 29/09/2025 debido a la alerta roja por condiciones meteorológicas adversas. Todas las clases quedan canceladas por seguridad.
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <a 
                  href="https://www.aemet.es/es/eltiempo/prediccion/avisos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-100 hover:text-white underline flex items-center gap-1"
                >
                  Ver avisos AEMET
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="http://www.112cv.gva.es" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-100 hover:text-white underline flex items-center gap-1"
                >
                  Emergencias 112 CV
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              className="-mr-1 flex p-2 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              onClick={() => setIsVisible(false)}
            >
              <span className="sr-only">Cerrar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}