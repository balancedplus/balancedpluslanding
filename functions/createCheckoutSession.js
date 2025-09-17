// functions/createCheckoutSession.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

require("dotenv").config();

const stripeSecret = process.env.STRIPE_SECRET;
const stripe = new Stripe(stripeSecret);

const db = admin.firestore();

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  console.log("===== createCheckoutSession called =====");
  console.log("Raw data received:", data);

  const { userId, stripePriceId, planType, mode, classesCredit, planPrice } = data.data || data;
  console.log("Parsed values:", { userId, stripePriceId, planType, mode, classesCredit });

  if (!userId || !stripePriceId || !mode) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Faltan datos requeridos"
    );
  }

  // Buscar usuario en Firestore
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Usuario no encontrado");
  }
  const user = userSnap.data();
  console.log("User found:", user.email);

  try {
    let customerId = user.stripeCustomerId;

    // Si no existe stripeCustomerId, creamos uno
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName || `${user.name || ''} ${user.surname || ''}`.trim() || user.email,
        metadata: { userId },
      });
      customerId = customer.id;
      await userRef.update({ stripeCustomerId: customerId });
      console.log("New Stripe customer created:", customerId);
    } else {
      console.log("Using existing Stripe customer:", customerId);
    }

    let sessionParams = {
      payment_method_types: ["card"],
      customer: customerId,
      success_url: "http://localhost:3000/stripeSuccess",
      cancel_url: "http://localhost:3000/stripeCancel",
    };

    if (mode === "subscription") {
      // NUEVA LÓGICA: Suscripción con trial + pago inmediato
      const trialEndDate = Math.floor(new Date("2025-11-01T00:00:00Z").getTime() / 1000); // Noviembre 2025
      
      sessionParams.mode = "subscription";
      
      // Line items: incluir tanto el pago inmediato como la suscripción
      sessionParams.line_items = [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Pago adelantado - Octubre 2025`,
              description: "Pago que cubre el mes de octubre"
            },
            unit_amount: parseInt(planPrice) * 100, // precio en céntimos
          },
          quantity: 1,
        },
        {
          price: stripePriceId,
          quantity: 1,
        }
      ];

      sessionParams.subscription_data = {
        metadata: { 
          userId, 
          planType,
          isSpecialLaunch: "true"
        },
        trial_end: trialEndDate,
      };

      // Personalizar texto del botón
      sessionParams.custom_text = {
        submit: {
          message: "Suscribirse"
        }
      };

      console.log("Creating subscription with trial end:", new Date(trialEndDate * 1000));

    } else {
      // Pago único (pack de clases individuales)
      sessionParams.mode = "payment";
      sessionParams.line_items = [{ price: stripePriceId, quantity: 1 }];
      sessionParams.metadata = {
        userId,
        planType,
        classes: classesCredit || 1, // Usar classesCredit del parámetro
        stripePriceId,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("Stripe session created:", session.id);

    return { sessionId: session.id };
  } catch (err) {
    console.error("Error creating Stripe session:", err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});