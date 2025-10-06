// functions/createCheckoutSession.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");
const { defineSecret } = require("firebase-functions/params");

//require("dotenv").config();

// Para local -> const stripeSecret = process.env.STRIPE_SECRET;
const stripeSecret = defineSecret("STRIPE_SECRET");
const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

const db = admin.firestore();

exports.createCheckoutSession = functions.https.onCall({
    secrets: [stripeSecret, webhookSecret]
  }, async (data, context) => {
    const stripe = new Stripe(stripeSecret.value());
    
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
      success_url: "http://balancedplus.es/stripeSuccess",
      cancel_url: "http://balancedplus.es/stripeCancel",
      allow_promotion_codes: true,
    };

    if (mode === "subscription") {
      // Suscripción mensual con prorrateo al siguiente día 1
      const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
        const billingCycleAnchor = Math.floor(nextMonth.getTime() / 1000);
        
        sessionParams.mode = "subscription";
        
        // Solo un line item: la suscripción con prorrateo
        sessionParams.line_items = [
          {
            price: stripePriceId,
            quantity: 1,
          }
        ];

        sessionParams.subscription_data = {
          metadata: { 
            userId, 
            planType,
          },
          billing_cycle_anchor: billingCycleAnchor,
          proration_behavior: 'create_prorations',
        };

        // Personalizar texto del botón
        sessionParams.custom_text = {
          submit: {
            message: "Suscribirse"
          }
        };

        console.log("Creating subscription with billing cycle anchor:", new Date(billingCycleAnchor * 1000));
        console.log("Proration enabled - first payment will be prorated");

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