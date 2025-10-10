// app/(main)/page.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function HomePage() {

  const [currentSlide, setCurrentSlide] = useState(0);

  const disciplines = [
    {
      title: 'PILATES REFORMER',
      description: 'Fortalece tu cuerpo y mejora tu postura con Pilates Reformer. Sesiones con máquinas profesionales adaptadas a tu nivel. Disfruta de un ambiente profesional y guiado por instructores expertos.',
      image: '/slider-pilates.jpg',
      imagePosition: 'right' // imagen a la derecha
    },
    {
      title: 'BARRE',
      description: 'Combina ballet, pilates y yoga en una clase energizante que tonifica todo tu cuerpo con movimientos inspirados en la danza. Trabaja fuerza, flexibilidad y equilibrio.',
      image: '/slider-barre.jpg',
      imagePosition: 'left'
    },
    {
      title: 'ENTRENAMIENTO FUNCIONAL',
      description: 'Entrenamientos dinámicos y personalizados diseñados para mejorar tu fuerza, resistencia y mantenerte activo. Ejercicios adaptados a tus necesidades guiados por entrenadores especializados.',
      image: '/slider-funcional.jpg',
      imagePosition: 'right'
    },
    {
      title: 'YOGA',
      description: 'Conecta cuerpo y mente a través de posturas, respiración y relajación. Reduce el estrés en un ambiente sereno y acogedor. Clases abiertas a todos los niveles.',
      image: '/slider-yoga.jpg',
      imagePosition: 'left' // imagen a la izquierda
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % disciplines.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + disciplines.length) % disciplines.length);
  };

  return (
    <div className="w-full">
      {/* Hero Section - Pantalla dividida */}
      <section className="flex flex-col md:flex-row gap-1 md:h-screen">
        {/* Mitad izquierda - Crema con logo y texto */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 py-16 md:py-0" style={{ backgroundColor: 'rgb(202, 200, 192)' }}>
          <div className="max-w-md text-center md:text-left">
            {/* Logo principal */}
            <div className="mb-8 flex justify-center md:justify-start">
            <Image
                src="/LogoWhite.png"
                alt="Balanced+"
                width={300}
                height={80}
                priority
                className="w-auto h-10 md:h-14"
            />
            </div>
            
            {/* Subtítulo */}
            <p className="text-lg md:text-xl font-light leading-relaxed" style={{ color: 'rgba(255, 255, 255, 1)' }}>
              Balanced es un concepto de espacio único.
              <br />
              Based in Valencia.
            </p>
            
          </div>
        </div>

        {/* Mitad derecha - Video */}
        <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen overflow-hidden">
        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
        >
            <source src="/video-inicio1080.mp4" type="video/mp4" />
            <source src="/hero-video.webm" type="video/webm" />
        </video>
          
            {/* Logo b+ en la esquina */}
            <div className="absolute top-8 right-8">
            <Image
                src="/MonogramaWhite.png"
                alt="b+"
                width={20}
                height={20}
                className="w-6 md:w-6 h-auto"
            />
            </div>
        </div>
      </section>

      {/* Sección de separación / introducción */}
        <section className="py-20 px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-thin mb-6" style={{ color: 'rgb(173, 173, 174)' }}>
                Encuentra tu equilibrio
                </h2>
                <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: 'rgb(173, 173, 174)' }}>
                Cuatro disciplinas diseñadas para transformar tu cuerpo y mente. 
                Descubre la práctica perfecta para ti en nuestro espacio en Godella.
                </p>
            </div>
        </section>

       {/* Slider Disciplinas */}
      <section className="relative min-h-screen md:min-h-screen flex items-center group overflow-hidden mt-1 md:mt-1 "style={{ backgroundColor: '#ffffff' }}>
        <div className="w-full h-full flex flex-col md:flex-row gap-1">
          {disciplines[currentSlide].imagePosition === 'left' ? (
            <>
              {/* Imagen a la izquierda */}
              <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
                <Image
                  src={disciplines[currentSlide].image}
                  alt={disciplines[currentSlide].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Texto a la derecha */}
              <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 py-16" style={{ backgroundColor: '#f5f5f0' }}>
                <div className="max-w-md">
                  <h3 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{ color: 'rgb(173, 173, 174)' }}>
                    {disciplines[currentSlide].title}
                  </h3>
                  <p className="text-base md:text-lg font-light leading-relaxed mb-8" style={{ color: 'rgb(173, 173, 174)' }}>
                    {disciplines[currentSlide].description}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Texto a la izquierda */}
              <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 py-16 order-2 md:order-1" style={{ backgroundColor: '#f5f5f0' }}>
                <div className="max-w-md">
                  <h3 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{ color: 'rgb(173, 173, 174)' }}>
                    {disciplines[currentSlide].title}
                  </h3>
                  <p className="text-base md:text-lg font-light leading-relaxed mb-8" style={{ color: 'rgb(173, 173, 174)' }}>
                    {disciplines[currentSlide].description}
                  </p>
                </div>
              </div>

              {/* Imagen a la derecha */}
              <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen order-1 md:order-2" style={{ backgroundColor: '#f5f5f0' }}>
                <Image
                  src={disciplines[currentSlide].image}
                  alt={disciplines[currentSlide].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </>
          )}
        </div>
        {/* Flechas minimalistas */}
            <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all duration-300 md:opacity-0 md:hover:opacity-100 md:group-hover:opacity-100 z-10"
            style={{ color: 'rgb(173, 173, 174)' }}
            aria-label="Anterior"
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
            </svg>
            </button>

            <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all duration-300 md:opacity-0 md:hover:opacity-100 md:group-hover:opacity-100 z-10"
            style={{ color: 'rgb(173, 173, 174)' }}
            aria-label="Siguiente"
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
            </svg>
            </button>

            {/* Indicadores centrados abajo */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {disciplines.map((_, idx) => (
                <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                    backgroundColor: currentSlide === idx ? 'rgb(173, 173, 174)' : 'rgba(173, 173, 174, 0.3)'
                }}
                aria-label={`Ir a slide ${idx + 1}`}
                />
            ))}
            </div>

            {/* Contador esquina derecha */}
            <div className="absolute bottom-8 right-8 text-xs font-light opacity-50 flex items-center gap-1" style={{ color: 'rgb(173, 173, 174)' }}>
            <span>{currentSlide + 1}</span>
            <span>/</span>
            <span>{disciplines.length}</span>
            </div>
      </section>

      {/* Sección Por qué Balanced+ */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-thin text-center mb-4" style={{ color: 'rgb(173, 173, 174)' }}>
            Por qué elegir Balanced+
          </h2>
          <p className="text-center mb-16 font-light" style={{ color: 'rgb(173, 173, 174)' }}>
            Un espacio diseñado para tu bienestar en Godella
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'Espacio amplio', desc: 'Local luminoso con luz natural' },
              { title: 'Clases reducidas', desc: 'Atención personalizada garantizada' },
              { title: 'Estética cuidada', desc: 'Ambiente acogedor y minimalista' },
              { title: 'Máquinas Reformer', desc: 'Equipamiento profesional Pilates Reformer' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-lg font-light mb-2 tracking-wide" style={{ color: 'rgb(173, 173, 174)' }}>
                  {item.title}
                </h3>
                <p className="text-sm font-light opacity-75" style={{ color: 'rgb(173, 173, 174)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 md:px-8" style={{ backgroundColor: '#cbc8bf' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-thin text-white mb-6">
            Elige el plan que más se adapte a ti
          </h2>
          <p className="text-lg text-white font-light mb-8 opacity-90">
            Sin pago de matrícula ni permanencia. Cambia o cancela cuando quieras.
          </p>
          <Link
            href="/tarifas"
            className="inline-block px-10 py-4 rounded-full text-sm tracking-wide font-light transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: '#fff', color: 'rgb(173, 173, 174)' }}
          >
            ELILGE TU PLAN
          </Link>
        </div>
      </section>

      {/* Ubicación */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-thin text-center mb-16" style={{ color: 'rgb(173, 173, 174)' }}>
            Visítanos en nuestro centro en Godella
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Info de contacto */}
            <div className="text-center lg:text-left space-y-6">
              <div>
                <h3 className="text-xl font-light mb-4" style={{ color: 'rgb(173, 173, 174)' }}>
                  Balanced+
                </h3>
                <p className="font-light leading-relaxed" style={{ color: 'rgb(173, 173, 174)' }}>
                  Avenida Acacias, 16<br />
                  Campolivar, 46110, Valencia<br />
                  <span className="text-sm opacity-75">(Entrada por el club deportivo)</span>
                </p>
              </div>
            </div>
            {/* Botón ver en mapa */}
            <div className="flex items-center justify-center lg:justify-start">
            <a
                href="https://www.google.com/maps/place/Balanced%2B/@39.5274798,-0.425833,68m/data=!3m1!1e3!4m14!1m7!3m6!1s0xd6045b0eacac64d:0x66baae4966c60ee4!2sBalanced%2B!8m2!3d39.5274775!4d-0.4257336!16s%2Fg%2F11yjmfpb5f!3m5!1s0xd6045b0eacac64d:0x66baae4966c60ee4!8m2!3d39.5274775!4d-0.4257336!16s%2Fg%2F11yjmfpb5f?entry=ttu&g_ep=EgoyMDI1MTAwNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-light text-sm tracking-wide transition-all duration-300 hover:opacity-80"
                style={{ backgroundColor: '#cbc8bf', color: '#fff' }}
            >   
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Ver en Google Maps</span>
            </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}