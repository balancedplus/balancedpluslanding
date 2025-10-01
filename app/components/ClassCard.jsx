"use client";

import { useMemo, useState } from "react";
import { formatHour } from "../../lib/dates";
import { useAuth } from "./AuthProvider";
import { makeReservation, cancelReservation } from "../../lib/reservations";
import { useToast } from "./ToastProvider";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ClassCard({ cls, userReservations = [] }) {
  const { user, isVerified } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(null); // 'reserve' o 'cancel'
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

  // Formatear fecha para mostrar en el diálogo
  const formatDate = (dateTime) => {
    const date = dateTime?.toDate ? dateTime.toDate() : new Date(dateTime);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const handleClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isVerified) {
      showError("Debes verificar tu correo para reservar");
      return;
    }

    // Mostrar diálogo de confirmación
    setActionType(myReservation ? 'cancel' : 'reserve');
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const clsDate = cls.dateTime.toDate ? cls.dateTime.toDate() : new Date(cls.dateTime);
      const clsDateStr = clsDate.toISOString().split("T")[0];

      if (actionType === 'reserve' && reservedDays.has(clsDateStr)) {
        showInfo("Solo se permite una clase por día.");
        setLoading(false);
        return;
      }

      if (actionType === 'cancel') {
        await cancelReservation(myReservation.id, user);
        showSuccess("Reserva cancelada");
      } else {
        await makeReservation({ user, cls });
        showSuccess("Clase reservada");
      }

    } catch (err) {
      console.error("Error en operación:", err);
      
      if (err.message.includes("No quedan plazas")) {
        showError("Lo sentimos, no quedan plazas disponibles");
      } else if (err.message.includes("No te quedan clases")) {
        showError("No tienes clases disponibles de este tipo");
      } else if (err.message.includes("menos de 2 horas")) {
        showError("No puedes cancelar con menos de 2 horas de antelación");
      } else if (err.message.includes("ya ha sido cancelada")) {
        showInfo("Esta reserva ya había sido cancelada");
      } else if (err.message.includes("Solo se permite una clase")) {
        showInfo("Solo puedes reservar una clase al día");
      } else {
        showError(err.message || "Ha ocurrido un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'cancel' ? 'Cancelar reserva' : 'Confirmar reserva'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'cancel' 
                ? `¿Estás seguro de que quieres cancelar tu reserva para ${cls.title || cls.type} el ${formatDate(cls.dateTime)} a las ${timeText}?`
                : `¿Confirmas que quieres reservar ${cls.title || cls.type} el ${formatDate(cls.dateTime)} a las ${timeText}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
          disabled={capacityLeft === 0 && !myReservation}
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
            ? "Clase Completa"
            : "Reservar"}
        </button>
      </div>
    </>
  );
}