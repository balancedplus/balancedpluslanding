"use client";

export default function SuccessPage() {
  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 flex flex-col items-center text-center">
      <h1 className="text-3xl mb-6" style={{ color: "rgb(173, 173, 174)" }}>
        ¡Suscripción completada!
      </h1>
      <p style={{ color: "rgb(173, 173, 174)" }}>
        Gracias por suscribirte. Tu pago se ha procesado correctamente.
      </p>
      <p className="mt-2 mb-6" style={{ color: "rgb(173, 173, 174)" }}>
        Ahora puedes acceder a todas las clases y packs disponibles en tu perfil.
      </p>
      <button
        onClick={() => window.location.href = "/miPerfil"}
        className="px-6 py-2 rounded-full transition-all duration-300"
        style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
      >
        Ir a mi Perfil
      </button>
    </div>
  );
}
