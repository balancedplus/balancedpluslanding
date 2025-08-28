"use client";

import { useState } from "react";

const PlanSection = ({ title, plans }) => {
  const [open, setOpen] = useState(false);

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
          open ? "max-h-[2500px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-16 md:gap-y-6">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="rounded-xl p-6 shadow-sm text-center flex flex-col items-center justify-center mt-6"
              style={{ backgroundColor: "#cbc8bf", padding: '1.5rem' }}
            >
              <h3 className="text-3xl font-thin text-white mt-4">{plan.title}</h3>
              <p className="mt-5 text-8xl font-thin text-white">
                {plan.price} <span className="text-3xl ml-0 align-bottom">€</span>
              </p>
              <p className="mt-2 text-sm text-white">{plan.sessionPrice}</p>
              <p className="mb-4 font-thin text-white">Sin permanencia</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanSection;
