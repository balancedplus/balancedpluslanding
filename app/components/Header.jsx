'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[rgb(244,244,244)] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 md:py-10 flex items-center justify-center relative">
          {/* Logo escritorio */}
          <Link href="/" className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <img src="/LogoBlack.png" alt="Logo Balanced+" className="h-12" />
          </Link>

          {/* Logo móvil */}
          <Link href="/" className="md:hidden absolute left-6">
            <img src="/MonogramaBlack.png" alt="Logo Balanced+" className="h-8" />
          </Link>

          {/* Navbar escritorio */}
          <nav className="hidden md:flex absolute right-6 space-x-6" style={{ color: 'rgb(173, 173, 174)' }}>
            <Link href="/horarios" className="hover:opacity-80 transition-opacity">
              Horarios
            </Link>
            <Link href="/tarifas" className="hover:opacity-80 transition-opacity">
              Tarifas
            </Link>
          </nav>

          {/* Navbar móvil centrado */}
          <nav className="flex md:hidden space-x-6 mx-auto text-center" style={{ color: 'rgb(173, 173, 174)' }}>
            <Link href="/horarios" className="hover:opacity-80 transition-opacity">
              Horarios
            </Link>
            <Link href="/tarifas" className="hover:opacity-80 transition-opacity">
              Tarifas
            </Link>
          </nav>
        </div>
      </header>

      {/* Espaciador para que el contenido no quede tapado */}
      <div className="h-20 md:h-24" />
    </>
  );
}
