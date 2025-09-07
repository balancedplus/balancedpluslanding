// app/myReservations/layout.jsx
"use client";

import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyReservationsLayout({ children }) {
  const { user, loading, isVerified } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (loading) return; // aún inicializando
    if (!user || !isVerified) {
      router.push("/miPerfil");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 text-center text-[rgb(173,173,174)]">
        Cargando autenticación...
      </div>
    );
  }

  return <>{children}</>;
}
