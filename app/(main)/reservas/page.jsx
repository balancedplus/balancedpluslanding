/*'use client';

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../components/AuthProvider";
import { subscribeClassesByDay } from "../../../lib/classes";
import { getUserReservations } from "../../../lib/reservations";
import ClassCard from "../../components/ClassCard";
import { db } from "../../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import DateSelect from "../../components/DateSelect";

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

    const q = query(
      collection(db, "reservations"),
      where("userId", "==", user.uid),
      where("status", "==", "active")
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const reservations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserReservations(reservations);
      }, 
      (error) => {
        console.error(error);
        getUserReservations(user.uid).then(res => setUserReservations(res));
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

// Filtrado por tipo de clase Y excluir 9 de octubre
const filteredClasses = useMemo(() => {
  let result = filter === "todas" ? classes : classes.filter(c => c.type === filter);
  
  // Filtrar clases del 9 de octubre (festivo)
  result = result.filter(c => {
    const classDate = c.dateTime?.toDate ? c.dateTime.toDate() : new Date(c.dateTime);
    const isOct9 = classDate.getMonth() === 9 && classDate.getDate() === 9;
    return !isOct9;
  });
  
  return result;
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

        // Filtros de tipo de clase
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
        ) : dateStr === "2025-10-09" ? (
          <div className="text-center py-8">
            <p className="text-xl font-medium text-[rgb(173,173,174)] mb-2">
              Centro cerrado - Festivo regional
            </p>
            <p className="text-[rgb(173,173,174)]">
              No hay clases disponibles este día
            </p>
          </div>
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
}*/

'use client';

import { useEffect, useState } from 'react';

export default function ReservasPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // Cargar el CSS primero
    const link = document.createElement('link');
    link.href = 'https://balanced-iframe.ismygym.com/iframe/iframe.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cargar el script del iframe
    const script = document.createElement('script');
    script.src = 'https://balanced-iframe.ismygym.com/iframe/iframe.min.js';
    script.async = true;
    
    script.onload = () => {
      setIframeLoaded(true);
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen">
    {/* Título */}
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-3xl text-center" style={{ color: "rgb(173, 173, 174)" }}>
        Reservar clase
      </h1>
      <p className="text-center mt-2" style={{ color: "rgb(173, 173, 174)" }}>
        Consulta el horario y reserva tu plaza en las clases disponibles
      </p>
    </div>

      {/* Iframe de ismygym */}
      <div className="w-full" style={{ minHeight: '800px' }}>
        <iframe
          src="https://balanced-iframe.ismygym.com/centro-balanced+/reservas?from="
          id="ism-iframe"
          sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
          allow="geolocation; payment"
          className="w-full border-0"
          style={{ 
            width: '100%',
            minHeight: '800px',
            display: iframeLoaded ? 'block' : 'none'
          }}
        />
        {!iframeLoaded && (
          <div className="w-full flex items-center justify-center" style={{ minHeight: '800px' }}>
            <p className="text-[rgb(173,173,174)]">Cargando...</p>
          </div>
        )}
      </div>
    </div>
  );
}