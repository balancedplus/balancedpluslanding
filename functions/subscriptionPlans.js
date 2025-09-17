// functions/subscriptionPlans.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

/**
 * Devuelve todos los planes de suscripción con su priceId
 */
exports.getSubscriptionPlans = functions.https.onCall(async (data, context) => {
  try {
    const plansSnap = await db.collection("subscription_plans").get();
    const plans = plansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { plans };
  } catch (err) {
    console.error("Error obteniendo planes de suscripción:", err);
    throw new functions.https.HttpsError(
      "internal",
      "No se pudieron obtener los planes"
    );
  }
});
    