'use client'

import PlanSection from "../../components/PlanSection";
import { classPlans } from "../../../data/plans";
import { sessionPacks } from "../../../data/sessionPacks";
import { useSubscriptionPlans } from "../../hooks/useSubscriptionPlans";

export default function TarifasPage() {
  const { plansFromFirestore, loading } = useSubscriptionPlans();

  // Merge front + firestore: se busca el type y se añade el stripePriceId
  const mergedClassPlans = classPlans.map(section => ({
    ...section,
    plans: section.plans.map(plan => {
      const fsPlan = plansFromFirestore.find(p => p.type === plan.type);

      if (fsPlan) {
        return { ...plan, stripePriceId: fsPlan.stripePriceId };
      } else {
        const availableTypes = plansFromFirestore.map(p => p.type).join(", ");
        return plan;
      }
    }),
  }));

  const mergedSessionPacks = sessionPacks.map(pack => {
    const fsPack = plansFromFirestore.find(p => p.type === pack.type);

    if (fsPack) {
      return { ...pack, stripePriceId: fsPack.stripePriceId };
    } else {
      const availableTypes = plansFromFirestore.map(p => p.type).join(", ");
      return pack;
    }
  });

  if (loading) return <p>Cargando planes...</p>;

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 md:px-0 flex flex-col items-center">
      <h1 className="text-3xl text-center" style={{ color: 'rgb(173, 173, 174)' }}>Elige tu plan</h1>
      <p className="text-center mt-2 mb-20"
        style={{ color: 'rgb(173, 173, 174)' }}>
        Elige una suscripción mensual sin permanencia y a un excelente precio por sesión.
      </p>

      {mergedClassPlans.map((cls) => (
        <PlanSection key={cls.title} title={cls.title} plans={cls.plans} />
      ))}

      <h1 className="text-3xl text-center mt-15" style={{ color: 'rgb(173, 173, 174)' }}>Pack de Sesiones</h1>
      <p className="text-center mt-2 mb-20"
        style={{ color: 'rgb(173, 173, 174)' }}>
        Elige un pack de sesiones para un uso flexible al mejor precio.
      </p>

      {/* 👇 Aquí usas los packs mergeados, no los estáticos */}
      <PlanSection title="Packs de Sesiones" plans={mergedSessionPacks} />
    </div>
  );
}
