'use client';
import Link from 'next/link';
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
        setShowHeader(false); // Scroll hacia abajo -> ocultar
      } else {
        setShowHeader(true); // Scroll hacia arriba -> mostrar
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
        animate={{ y: showHeader ? 0 : -80 }} // Desliza hacia arriba 80px al esconder
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 w-full z-50 bg-[rgb(244,244,244)] shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between relative">
          {/* Nav izquierda */}
          <nav className="hidden md:flex space-x-6 text-[rgb(173,173,174)]">
            {leftLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="hover:opacity-80 transition-opacity">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo centrado */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
            <img src="/LogoBlack.png" alt="Logo Balanced+" className="h-10 md:h-12" />
          </Link>

          {/* Nav derecha */}
          <nav className="hidden md:flex space-x-6 text-[rgb(173,173,174)]">
            {rightLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="hover:opacity-80 transition-opacity">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botón menú móvil */}
          <div className="flex md:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="text-2xl text-[rgb(173,173,174)]"
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-[rgb(244,244,244)] w-full px-6 py-6 flex flex-col space-y-3 text-[rgb(173,173,174)] overflow-hidden"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
                }}
              >
                {[...leftLinks, ...rightLinks].map((link, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className="hover:opacity-80 transition-opacity block py-1"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Espaciador fijo */}
      <div className="h-12 md:h-12" />
    </>
  );
}
