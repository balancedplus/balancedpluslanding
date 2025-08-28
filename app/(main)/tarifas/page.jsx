import PlanSection from "../../components/PlanSection";
import { classPlans } from "../../../data/plans";
import { sessionPacks } from "../../../data/sessionPacks";

export default function TarifasPage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 md:px-0 flex flex-col items-center">
      <h1 className="text-3xl text-center" style={{ color: 'rgb(173, 173, 174' }}>Mensualidades</h1>
      <p className="text-center mt-2 mb-20"
        style={{ color: 'rgb(173, 173, 174)' }}>
        Elige una suscripción mensual sin permanencia y a un excelente precio por sesión.
      </p>

      {classPlans.map((cls) => (
        <PlanSection key={cls.title} title={cls.title} plans={cls.plans} />
      ))}

      <h1 className="text-3xl text-center mt-15" style={{ color: 'rgb(173, 173, 174' }}>Pack de Sesiones</h1>
      <p className="text-center mt-2 mb-20"
        style={{ color: 'rgb(173, 173, 174)' }}>
        Elige un pack de sesiones para un uso flexible al mejor precio.
      </p>

       <PlanSection title="Packs de Sesiones" plans={sessionPacks} />

    </div>
    
  );
}
