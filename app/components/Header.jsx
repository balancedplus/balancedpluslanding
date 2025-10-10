'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from './AuthProvider';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLinkClick = () => setMenuOpen(false);

  // Detectar scroll para esconder header en móvil
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  const leftLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/horarios', label: 'Horarios' },
    { href: '/tarifas', label: 'Tarifas' },
    { href: '/reservas', label: 'Reservar Clases' },
  ];

  const rightLinks = user
    ? [
        { href: '/misReservas', label: 'Mis Reservas' },
        { href: '/miPerfil', label: 'Mi perfil' },
      ]
    : [{ href: '/login', label: 'Iniciar Sesión' }];

  return (
    <>
      <motion.header
        animate={{ y: showHeader ? 0 : -80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 w-full z-50 bg-[rgb(244,244,244)] shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between relative">
          {/* Nav izquierda */}
          <nav className="hidden md:flex space-x-6 text-[rgb(173,173,174)] text-base font-light">
            {leftLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="hover:opacity-70 transition-opacity">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo centrado */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
            <Image 
              src="/LogoBlack.png" 
              alt="Balanced+" 
              width={120}
              height={40}
              className="h-10 md:h-12 w-auto" 
              priority
            />
          </Link>

          {/* Nav derecha */}
          <nav className="hidden md:flex space-x-6 text-[rgb(173,173,174)] text-base font-light">
            {rightLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="hover:opacity-70 transition-opacity">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botón menú móvil */}
          <div className="flex md:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="text-2xl transition-colors"
              style={{ color: 'rgb(173, 173, 174)' }}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable MEJORADO */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-[rgb(244,244,244)] w-full overflow-hidden border-t border-gray-200"
            >
              <div className="px-6 py-6 flex flex-col space-y-1">
                {[...leftLinks, ...rightLinks].map((link, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className="block py-3 px-4 rounded-lg font-light text-base transition-all duration-200"
                      style={{ 
                        color: 'rgb(173, 173, 174)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(203, 200, 191, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {link.label}
                    </Link>
                    {/* Separador entre links */}
                    {idx < leftLinks.length + rightLinks.length - 1 && (
                      <div 
                        className="h-px my-1 opacity-20" 
                        style={{ backgroundColor: 'rgb(173, 173, 174)' }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Espaciador fijo */}
      <div className="h-10 md:h-10" />
    </>
  );
}