// functions/utils/subscriptionHelpers.js
const admin = require("firebase-admin");

/**
 * Calcula el número de clases según el plan y si es prorrateado.
 */
function calculateClasses(planType, startDate, endDate, isProrated = false) {
    const planClasses = {
        // Pilates
        pilates_4: { pilates: 4 },
        pilates_8: { pilates: 8 },
        pilates_12: { pilates: 12 },

        // Funcional
        funcional_4: { funcional: 4 },
        funcional_8: { funcional: 8 },
        funcional_12: { funcional: 12 },

        // Barre
        barre_4: { barre: 4 },
        barre_8: { barre: 8 },
        barre_12: { barre: 12 },

        // Yoga
        yoga_4: { yoga: 4 },
        yoga_8: { yoga: 8 },
        yoga_12: { yoga: 12 },

        // Combinados
        funcional_pilates_4_4: { funcional: 4, pilates: 4 },
        funcional_pilates_8_4: { funcional: 8, pilates: 4 },
        pilates_funcional_8_4: { pilates: 8, funcional: 4 },

        yoga_pilates_4_4: { yoga: 4, pilates: 4 },
        yoga_pilates_8_4: { yoga: 8, pilates: 4 },
        pilates_yoga_8_4: { pilates: 8, yoga: 4 },

        barre_pilates_4_4: { barre: 4, pilates: 4 },
        barre_pilates_8_4: { barre: 8, pilates: 4 },
        pilates_barre_8_4: { pilates: 8, barre: 4 },

        // Ilimitado
        combinadas_ilimitadas: {
        yoga: Infinity,
        pilates: Infinity,
        funcional: Infinity,
        barre: Infinity,
        },
    };

  const base = planClasses[planType] || {};
  if (!isProrated) return base;

  // prorrateo
  const totalDays = daysInMonth(startDate);
  const remainingDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
  const ratio = remainingDays / totalDays;

  let prorated = {};
  for (const [key, value] of Object.entries(base)) {
    prorated[key] = Math.ceil(value * ratio);
  }

  return prorated;
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

async function updateUserSubscription(userId, subscriptionData) {
  const userRef = admin.firestore().collection("users").doc(userId);
  await userRef.set(
    {
      subscription: {
        ...subscriptionData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    },
    { merge: true }
  );
}

module.exports = {
  calculateClasses,
  updateUserSubscription,
};
