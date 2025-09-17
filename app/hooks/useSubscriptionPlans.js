"use client";

import { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";

export function useSubscriptionPlans() {
  const [plansFromFirestore, setPlansFromFirestore] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const functions = getFunctions();
        const getPlans = httpsCallable(functions, "getSubscriptionPlans");
        const result = await getPlans();
        setPlansFromFirestore(result.data.plans);
      } catch (err) {
        console.error("Error fetching subscription plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plansFromFirestore, loading };
}
