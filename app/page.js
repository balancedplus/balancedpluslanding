'use client'
import Image from "next/image";
import { useState } from 'react';
import { MapPin } from "lucide-react";


export default function Home() {

  const [email, setEmail]   = useState('');
  const [loading, setLoad]  = useState(false);
  const [ok, setOk]         = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setOk(false);
      setErrorMsg("Email inválido. Revisa el formato.");
      return;
    }

    try {
      setLoad(true);
      setErrorMsg('');
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();

      if (!json.ok) {
        setOk(false);
        setErrorMsg(json.error || "Error desconocido.");
      } else {
        setOk(true);
      }

    } catch (_) {
      setOk(false);
      setErrorMsg("Error de conexión. Intenta más tarde.");
    } finally {
      setLoad(false);
    }
  };

  return (
  <div className="landing-wrapper">
  <div className="background-image"></div>
  <div className="overlay"></div>

  <div className="w-full max-w-[30rem] mx-auto text-center text-white z-20 relative mt-16 mb-8 px-4">
    <p className="text-sm text-gray-200 leading-relaxed">
      Balanced+ es un espacio diseñado para reconectar cuerpo y mente a través del <strong className="font-semibold text-white">Pilates</strong>, <strong className="font-semibold text-white">Yoga</strong>, <strong className="font-semibold text-white">Barre</strong> y <strong className="font-semibold text-white">Entrenamiento Funcional</strong>.
      Un Club donde el cuidado estético se une al bienestar integral.
    </p>


  <h1 className="text-lg font-semibold mt-6 text-white">
    APERTURA en SEPTIEMBRE 2025
  </h1>
</div>



  <div className="max-w-[28rem] w-full rounded-xl border border-white/30 bg-white/10 p-6 px-4 sm:px-6 backdrop-blur-lg text-white shadow-lg relative z-20">
    <h2 className="text-xl font-semibold mb-2">¿QUIERES ESTAR INFORMADO?</h2>
    <p className="text-sm text-gray-200 mb-4">Déjanos tu correo para avisarte de las últimas novedades.</p>

    <input
      type="email"
      placeholder="Tu correo electrónico"
      className="w-full rounded-md border border-white/30 bg-white/15 p-3 text-white placeholder-gray-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40 mb-4"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <button
      onClick={handleSubmit}
      disabled={loading}
      className="w-full rounded-md border border-white/30 bg-white/30 p-3 text-white font-semibold transition hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Enviando…" : "Enviar"}
    </button>

    {ok === true && <p className="mt-3 text-green-400 text-sm">✔ ¡Gracias! Te avisaremos.</p>}
    {ok === false && <p className="mt-3 text-red-400 text-sm">✖ {errorMsg}</p>}

</div>


    <div className="z-20 mt-10 max-w-[28rem] w-full rounded-xl border border-white/30 bg-white/10 p-6 backdrop-blur-lg text-white shadow-lg relative z-20">
    <h2 className="mb-1 text-sm font-medium tracking-widest text-neutral-50">
      Ubicación
    </h2>
    <h3 className="text-xl font-semibold text-white">CLUB DEPORTIVO CAMPOLIVAR</h3>
    <address className="mt-2 not-italic leading-tight text-gray-300 z-[2]">
      Av. Acàcies, 16<br />
      Campolivar, Valencia, España
    </address>
    <a
      href="https://www.google.es/maps/place/Club+Deportivo+Campo+Olivar/@39.5274531,-0.4257854,20.1z/data=!4m6!3m5!1s0xd60451e027bbb9f:0xa9dae2b42f88c367!8m2!3d39.5275323!4d-0.4258424!16s%2Fg%2F1z44b5xbg?hl=es&entry=ttu&g_ep=EgoyMDI1MDYxMS4wIKXMDSoASAFQAw%3D%3D"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/40"
    >
      <MapPin size={16} strokeWidth={1.8} />
      Ver mapa
    </a>
  </div>

  <div className="claim">
    <img src="/claimwhite.png" alt="Claim" style={{ width: "150px" }} />
  </div>

</div>

 

  );
}

