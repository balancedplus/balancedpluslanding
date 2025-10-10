"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-12" style={{ backgroundColor: '#f5f5f0', borderColor: 'rgba(173, 173, 174, 0.2)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-1">
            <Image
              src="/LogoBlack.png"
              alt="Balanced+"
              width={150}
              height={40}
              className="w-auto h-8 mb-4"
            />
            <p className="text-sm font-light leading-relaxed" style={{ color: 'rgb(173, 173, 174)' }}>
              Centro de pilates reformer, barre, entrenamiento funcional y yoga en Godella.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-sm font-medium mb-4 tracking-wide" style={{ color: 'rgb(173, 173, 174)' }}>
              NAVEGACIÓN
            </h3>
            <ul className="space-y-2 text-sm font-light">
              <li>
                <Link href="/reservas" className="hover:opacity-70 transition-opacity" style={{ color: 'rgb(173, 173, 174)' }}>
                  Reservar clase
                </Link>
              </li>
              <li>
                <Link href="/tarifas" className="hover:opacity-70 transition-opacity" style={{ color: 'rgb(173, 173, 174)' }}>
                  Tarifas
                </Link>
              </li>
              <li>
                <Link href="/horarios" className="hover:opacity-70 transition-opacity" style={{ color: 'rgb(173, 173, 174)' }}>
                  Horarios
                </Link>
              </li>
            </ul>
          </div>

          {/* Disciplinas */}
          <div>
            <h3 className="text-sm font-medium mb-4 tracking-wide" style={{ color: 'rgb(173, 173, 174)' }}>
              DISCIPLINAS
            </h3>
            <ul className="space-y-2 text-sm font-light" style={{ color: 'rgb(173, 173, 174)' }}>
              <li>Pilates Reformer</li>
              <li>Yoga</li>
              <li>Entrenamiento Funcional</li>
              <li>Barre</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-medium mb-4 tracking-wide" style={{ color: 'rgb(173, 173, 174)' }}>
              CONTACTO
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <a 
                  href="https://wa.me/34678528165" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                  style={{ color: 'rgb(173, 173, 174)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  +34 678 52 81 65
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@balancedplus.es"
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: 'rgb(173, 173, 174)' }}
                >
                  info@balancedplus.es
                </a>
              </li>
              <li style={{ color: 'rgb(173, 173, 174)' }}>
                Avenida Acacias, 16<br />
                Campolivar, 46110<br />
                Valencia
              </li>
            </ul>
          </div>

        </div>

        {/* Separador */}
        <div className="border-t pt-6" style={{ borderColor: 'rgba(173, 173, 174, 0.2)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light" style={{ color: 'rgb(173, 173, 174)' }}>
            
            {/* Copyright */}
            <p>© {new Date().getFullYear()} Balanced+. Todos los derechos reservados.</p>

           {/* Links legales */}
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-end text-center">
              <Link href="/aviso-legal" className="hover:opacity-70 transition-opacity">
                Aviso Legal
              </Link>
              <span className="opacity-50">•</span>
              <Link href="/privacidad" className="hover:opacity-70 transition-opacity">
                Privacidad
              </Link>
              <span className="opacity-50">•</span>
              <Link href="/cookies" className="hover:opacity-70 transition-opacity">
                Cookies
              </Link>
              <span className="opacity-50">•</span>
              <Link href="/terminos" className="hover:opacity-70 transition-opacity">
                Términos
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}