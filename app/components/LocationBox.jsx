// app/components/LocationBox.jsx
import { MapPin } from "lucide-react";

export default function LocationBox() {
  return (
    <div className=" z-2 mt-10 w-full max-w-[28rem] rounded-xl border border-white/30 bg-white/10 p-6 backdrop-blur-lg m-px-10">
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
  );
}
