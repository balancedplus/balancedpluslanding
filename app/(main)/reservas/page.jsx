'use client';

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../components/AuthProvider";
import { subscribeClassesByDay } from "../../../lib/classes";
import { getUserReservations } from "../../../lib/reservations";
import ClassCard from "../../components/ClassCard";
import { db } from "../../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import DateSelect from "../../components/DateSelect";
import { subscribeUserReservations } from "../../../lib/reservations";

export default function ReservasPage() {
  const { user, isVerified } = useAuth();
 const [dateStr, setDateStr] = useState(() => {
  const today = new Date();
  const defaultDate = new Date(today.getFullYear(), 8, 16);
  return today.toISOString().split("T")[0];
});
  const [classes, setClasses] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tipos de clase y mapping display → valor BD
  const classTypes = [
    { label: "Todas", value: "todas" },
    { label: "Yoga", value: "yoga" },
    { label: "P. Reformer", value: "pilates" },
    { label: "Funcional", value: "funcional" },
    { label: "Barre", value: "barre" },
  ];

  const [filter, setFilter] = useState("todas");

  // Suscripción a clases del día
  useEffect(() => {
    setLoading(true);
    const unsub = subscribeClassesByDay(
      dateStr,
      (list) => {
        setClasses(list);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [dateStr]);

  // Suscripción a reservas del usuario en tiempo real
  useEffect(() => {
    if (!user || !isVerified) {
      setUserReservations([]);
      return;
    }

    const unsubscribe = subscribeUserReservations(
     user.uid,
     (reservations) => setUserReservations(reservations),
     (err) => {
       console.error("Error escuchando reservas:", err);
       setUserReservations([]);
     }
   );
    

    return () => unsubscribe();
  }, [user]);

    // Días reservados
  const reservedDays = useMemo(() => {
  return new Set(
    userReservations.map((r) => {
      // Si es Timestamp de Firestore, usar toDate()
      const resDate = r.dateTime?.toDate ? r.dateTime.toDate() : new Date(r.dateTime);
      return resDate.toISOString().split("T")[0];
    })
  );
}, [userReservations]);

  // Filtrado por tipo de clase (usar value en minúscula)
  const filteredClasses = useMemo(() => {
    let list = classes;

    if (filter !== "todas") {
      list = list.filter(c => c.type === filter)
    }
    
    list = list.filter(c => c.status !== "closed");

    return list;
  }, [classes, filter]);

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 md:px-0 flex flex-col">
      <h1 className="text-3xl text-center mb-2" style={{ color: "rgb(173, 173, 174)" }}>
        Reservar clase
      </h1>
      <p className="text-center mb-8" style={{ color: "rgb(173, 173, 174)" }}>
        Selecciona un día para ver las clases disponibles.
      </p>

      <DateSelect value={dateStr} onChange={setDateStr} />

        {/* Filtros por tipo */}
        <div className="overflow-x-auto hide-scrollbar mb-6">
            <div className="flex gap-4 justify-start md:justify-center">
                {classTypes.map(({ label, value }) => (
                <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className="px-4 py-2 font-medium rounded-full transition-colors flex-shrink-0"
                    style={{
                    backgroundColor: filter === value ? '#cbc8bf' : 'transparent',
                    color: filter === value ? 'white' : 'rgb(173,173,174)',
                    }}
                >
                    {label}
                </button>
                ))}
            </div>
        </div>

      {loading ? (
        <p className="text-center text-[rgb(173,173,174)]">Cargando clases...</p>
      ) : filteredClasses.length === 0 ? (
        <p className="text-center text-[rgb(173,173,174)]">No hay clases disponibles para este filtro.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClasses.map((c) => (
            <ClassCard
              key={c.id}
              cls={c}
              userReservations={userReservations}
            />
          ))}
        </div>
      )}
    </div>
  );
}
