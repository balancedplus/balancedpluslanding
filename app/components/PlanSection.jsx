"use client";

import { useState } from "react";
import { useAuth } from "../components/AuthProvider"; // ajusta la ruta según tu proyecto
import { getFunctions, httpsCallable } from "firebase/functions";
import { loadStripe } from "@stripe/stripe-js";

const PlanSection = ({ title, plans }) => {
  const [open, setOpen] = useState(true);
  const { user } = useAuth(); // <--- aquí traes el user
  const [isLoading, setIsLoading] = useState(false);

  // Suscripciones
  const handleSubscribe = async (stripePriceId, planType) => {
  if (!user) return alert("Inicia sesión primero");
  if (isLoading) return; // Prevenir múltiples clics

  setIsLoading(true);

  const functions = getFunctions();
  const createCheckoutSession = httpsCallable(functions, "createCheckoutSession");

  try {
    // Encontrar el plan actual para obtener su precio
    const currentPlan = plans.find(p => p.stripePriceId === stripePriceId);
    
    const { data } = await createCheckoutSession({ 
      userId: user.uid, 
      stripePriceId, 
      planType, 
      mode: "subscription",
      planPrice: currentPlan?.price || 0
    });
    
    const stripe = await loadStripe("pk_live_51RiAZFJK71CZc9AoVuhx4u00tmq12GISu8FOBAKd93LO379H01xTNh8IvrvTdMOOi52xn1jPprVDif7UUthUv2oh00PJRYVxHz");
    await stripe.redirectToCheckout({ sessionId: data.sessionId });
  } catch (err) {
    console.error(err);
    alert("Error creando la sesión de suscripción");
  } finally {
    setIsLoading(false);
  }
};

  // Pagos únicos (packs)
const handlePurchase = async (stripePriceId, planType, classesCredit) => {
  if (!user) return alert("Inicia sesión primero");

  const functions = getFunctions();
  const createCheckoutSession = httpsCallable(functions, "createCheckoutSession");

  try { 
    const { data } = await createCheckoutSession({ 
      userId: user.uid, 
      stripePriceId, 
      planType, 
      mode: "payment", 
      classesCredit
    });
    const stripe = await loadStripe("pk_live_51RiAZFJK71CZc9AoVuhx4u00tmq12GISu8FOBAKd93LO379H01xTNh8IvrvTdMOOi52xn1jPprVDif7UUthUv2oh00PJRYVxHz"); 
    await stripe.redirectToCheckout({ sessionId: data.sessionId });
  } catch (err) {
    console.error(err);
    alert("Error creando la sesión de pago único");
  }
};

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 px-12 sm:px-6 md:px-0">
      {/* Título de sección */}
      <h2
        className="text-3xl cursor-pointer border-b pb-2 mb-4"
        style={{ color: 'rgb(173, 173, 174)' }}
        onClick={() => setOpen(!open)}
      >
        {title} {open ? "−" : "+"}
      </h2>

      {/* Grid de planes con animación */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[5200px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-16 md:gap-y-6">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="rounded-xl p-6 shadow-sm text-center flex flex-col items-center justify-center mt-6"
              style={{ backgroundColor: "#cbc8bf", padding: '1.5rem' }}
            >
              <h3 className="text-2xl font-thin text-white mt-4">{plan.title}</h3>
              <p className="mt-5 text-8xl font-thin text-white inline-flex items-end">
                {plan.price} <span className="text-3xl ml-2">€</span>
              </p>

              <p className="mt-2 text-sm text-white">{plan.sessionPrice}</p>
              <p className="mb-4 font-thin text-white">Sin permanencia</p>

              {plan.type.includes("session") ? (
                <button
                  onClick={() => handlePurchase(plan.stripePriceId, plan.type, plan.classesCredit)}
                  className="mt-3 rounded-md py-2 font-medium transition w-full"
                  style={{ backgroundColor: "#fff", color: "rgb(173, 173, 174)" }}
                >
                  Comprar
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.stripePriceId, plan.type)}
                  disabled={isLoading}
                  className="mt-3 rounded-md py-2 font-medium transition w-full disabled:opacity-50"
                  style={{ backgroundColor: "#fff", color: "rgb(173, 173, 174)" }}
                >
                  {isLoading ? "Cargando..." : "Suscribirse"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanSection;
