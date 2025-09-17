"use client";

import { useAuth } from "../../components/AuthProvider";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import ClassCard from "../../components/ClassCard";
import Link from "next/link";

export default function MisReservasPage() {
  const { user, isVerified } = useAuth();
  const [classesWithReservations, setClassesWithReservations] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  useEffect(() => {
    if (!user || !isVerified) return;

    setLoadingPage(true);

    const q = query(
      collection(db, "reservations"),
      where("userId", "==", user.uid),
      where("status", "==", "active")
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const now = new Date();
        const reservations = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const classPromises = reservations.map(async (r) => {
          try {
            const clsSnap = await getDoc(doc(db, "classes", r.classId));
            if (!clsSnap.exists()) return null;
            const cls = { id: clsSnap.id, ...clsSnap.data(), myReservation: r };
            const classDate = cls.dateTime?.toDate?.() ?? new Date(cls.dateTime);
            return classDate >= now ? cls : null;
          } catch (err) {
            console.error("Error cargando clase:", err);
            return null;
          }
        });

        const resolved = (await Promise.all(classPromises)).filter(Boolean);

        resolved.sort((a, b) => {
          const da = a.dateTime?.toDate?.() ?? new Date(a.dateTime);
          const dbt = b.dateTime?.toDate?.() ?? new Date(b.dateTime);
          return da - dbt;
        });
        setClassesWithReservations(resolved);
        setLoadingPage(false);
      },
      (err) => {
        console.error("❌ Error en snapshot reservas:", err);
        setLoadingPage(false);
      }
    );
    return () => unsubscribe();
  }, [user]);
  // 👉 Agrupar clases por día
  const groupedByDay = classesWithReservations.reduce((acc, cls) => {
    const date = cls.dateTime?.toDate?.() ?? new Date(cls.dateTime);
    const dayLabel = date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!acc[dayLabel]) acc[dayLabel] = [];
    acc[dayLabel].push(cls);
    return acc;
  }, {});
  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 md:px-0 flex flex-col">
      <h1
        className="text-3xl text-center mb-2"
        style={{ color: "rgb(173, 173, 174)" }}
      >
        Mis reservas
      </h1>
      <p className="text-center mb-8" style={{ color: "rgb(173, 173, 174)" }}>
        Aquí puedes ver y gestionar tus próximas clases.
      </p>
      {loadingPage ? (
        <p className="text-center text-[rgb(173,173,174)]">
          Cargando tus reservas...
        </p>
      ) : classesWithReservations.length === 0 ? (
        <div className="flex flex-col items-center mt-6">
          <p className="text-center text-[rgb(173,173,174)]">
            No tienes reservas futuras.
          </p>
          <Link href="/reservas">
            <button
              className="mt-4 rounded-md py-2 px-6 transition"
              style={{ backgroundColor: '#cbc8bf', color: "#fff" }}
            >
              Haz tu primera reserva aquí
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedByDay).map(([day, dayClasses], index, arr) => (
            <div key={day}>
              <h2
                className="text-xl  mb-4 text-center"
                style={{ color: "rgb(173, 173, 174)" }}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dayClasses.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    cls={cls}
                    userReservations={[cls.myReservation]}
                  />
                ))}
              </div>
              {/* Separador entre días excepto el último */}
              {index < arr.length - 1 && (
                <div className="my-10 border-t border-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}