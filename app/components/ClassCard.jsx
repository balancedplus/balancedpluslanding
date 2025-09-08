"use client";

import { use, useMemo } from "react";
import { formatHour } from "../../lib/dates";
import { useAuth } from "./AuthProvider";
import { makeReservation, cancelReservation } from "../../lib/reservations";
import { useState } from "react";
import { useToast } from "./ToastProvider";
import { useRouter } from "next/navigation";

export default function ClassCard({ cls, userReservations = [] }) {

  const { user, isVerified } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();
  const router = useRouter();


  // Crear set de días ya reservados
  const reservedDays = useMemo(() => {
    return new Set(
      userReservations.map((r) => {
        const resDate = r.dateTime?.toDate ? r.dateTime.toDate() : new Date(r.dateTime);
        return resDate.toISOString().split("T")[0];
      })
    );
  }, [userReservations]);

  const capacity = typeof cls.capacity === "number" ? cls.capacity : null;
  const attendeesCount = Array.isArray(cls.atendees) ? cls.atendees.length : 0;
  const capacityLeft =
    typeof cls.capacityLeft === "number"
      ? cls.capacityLeft
      : capacity != null
      ? Math.max(0, capacity - attendeesCount)
      : null;

  const timeText = cls.dateTime ? formatHour(cls.dateTime) : "";

    const myReservation = userReservations?.find(
    (r) => r.classId === cls.id && r.status === "active"
    );

    const handleClick = async () => {
            if (!user) {
                router.push("/login");
                    return;
                }
                if (!isVerified) {
                    showError("Debes verificar tu correo para reservar");
                return;
            }
    
    setLoading(true);

    try {

        const clsDate = cls.dateTime.toDate ? cls.dateTime.toDate() : new Date(cls.dateTime);
        const clsDateStr = clsDate.toISOString().split("T")[0];

        if (!myReservation && reservedDays.has(clsDateStr)) {
            showInfo("Durante el periodo de puertas abiertas solo se permite una clase por día.");
            setLoading(false);
            return;
        }

        if (myReservation) {
        await cancelReservation(myReservation.id, user);
        showSuccess("Reserva cancelada");
        } else {
        await makeReservation({ user, cls });
        showSuccess("Clase reservada");
        }

    } catch (err) {
      console.error("Error en operación:", err);
      
      // Mensajes de error más específicos
      if (err.message.includes("No quedan plazas")) {
        showError("Lo sentimos, no quedan plazas disponibles");
      } else if (err.message.includes("No te quedan clases")) {
        showError("Has agotado tus clases disponibles de este tipo");
      } else if (err.message.includes("menos de 2 horas")) {
        showError("No puedes cancelar con menos de 2 horas de antelación");
      } else if (err.message.includes("ya ha sido cancelada")) {
        showInfo("Esta reserva ya había sido cancelada");
      } else if (err.message.includes("Solo se permite una clase")) {
        showInfo("Durante el periodo puertas abiertas solo puedes reservar una clase al día");
      } else {
        showError(err.message || "Ha ocurrido un error inesperado");
      }
    } finally {
      setLoading(false);
    }
    };

  return (
    <div
      className="rounded-xl p-6 shadow-sm flex flex-col gap-2"
      style={{ backgroundColor: "#cbc8bf" }}
    >
    <div className="flex items-center justify-between">
        <h3 className="text-2xl font-thin text-white">{cls.title || cls.type}</h3>
        <span className="text-white text-sm opacity-90">{timeText}</span>
        </div>


        <button
            onClick={handleClick}
            disabled={capacityLeft === 0}
            className="mt-3 rounded-md py-2 font-medium transition"
            style={{ backgroundColor: "#fff", color: "rgb(173, 173, 174)" }}
            >
            {loading
            ? "Procesando..."
            : !user
            ? "Inicia sesión para reservar"
            : myReservation
            ? "Cancelar reserva"
            : capacityLeft === 0
            ? "Agotado"
            : "Reservar"}
        </button>
    </div>
  );
}
