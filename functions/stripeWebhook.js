const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const Stripe = require("stripe");
const { defineSecret } = require("firebase-functions/params");

const db = admin.firestore();

/**
 * Webhook de Stripe para manejar eventos de suscripciones y pagos
 */
const stripeSecret = defineSecret("STRIPE_SECRET");
const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

exports.stripeWebhook = onRequest({
  secrets: [stripeSecret, webhookSecret]
}, async (request, response) => {
  const stripe = new Stripe(stripeSecret.value(), {
    apiVersion: "2025-01-27.acacia",
  });

  const sig = request.headers["stripe-signature"];
  if (!sig) {
    response.status(400).send("Missing stripe-signature header");
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      webhookSecret.value()
    );
  } catch (err) {
    logger.error("Webhook signature verification failed:", err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Ahora SÍ tenemos el evento definido
  const eventType = event.type;
  const data = event.data.object;

  try {
    switch (eventType) {
      
      // ================= SUSCRIPCIONES =================
      case "customer.subscription.created": {
    console.log("=== DEBUGGING SUBSCRIPTION CREATED ===");
          console.log("Subscription object:", JSON.stringify(data, null, 2));
          console.log("Metadata:", data.metadata);
          console.log("Items:", data.items.data[0]);
          console.log("=======================================");
        const subscription = data;
        const stripeCustomerId = subscription.customer;

        // Obtener usuario por stripeCustomerId
        const userSnap = await db.collection("users")
          .where("stripeCustomerId", "==", stripeCustomerId)
          .limit(1)
          .get();

        if (userSnap.empty) {
          logger.warn(`No se encontró usuario para Stripe customer ${stripeCustomerId}`);
          break;
        }

        const userDoc = userSnap.docs[0];
        const userRef = userDoc.ref;
        const userId = userDoc.id;

        // Obtener datos del plan desde Firestore
        const planType = subscription.items.data[0].price.nickname || 
                        subscription.metadata?.planType || "unknown";
        
        const planSnap = await db.collection("subscription_plans")
          .where("type", "==", planType)
          .limit(1)
          .get();

          console.log(`Plan query result - empty: ${planSnap.empty}, size: ${planSnap.size}`);


        if (!planSnap.empty) {
  console.log(`Plan found:`, planSnap.docs[0].data());
} else {
  // Verificar si existen documentos en la collection
  const allPlans = await db.collection("subscription-plans").limit(5).get();
  console.log(`Total plans in collection: ${allPlans.size}`);
  allPlans.docs.forEach(doc => {
    console.log(`Plan doc: ${doc.id}, type: ${doc.data().type}`);
  });
}
        const planData = planSnap.docs[0].data();
         // Obtener datos actuales del usuario para preservar campos existentes
        const currentUserData = userDoc.data();

        // Fechas de la suscripción
        const startDate = new Date(subscription.current_period_start * 1000);
        const endDate = new Date(subscription.current_period_end * 1000);

        // Calcular si está prorrateado (no empieza el día 1)
        const isProrated = startDate.getUTCDate() !== 1;

        // Calcular prorrateo de clases
        let classesForPeriod = { ...planData.classesIncluded };
        
        if (isProrated) {
          const totalDaysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
          const proportion = totalDaysInPeriod / daysInMonth;
          
          // Aplicar proporción a las clases incluidas
          const proratedClasses = {};
          Object.entries(planData.classesIncluded || {}).forEach(([type, count]) => {
            // Redondear hacia arriba para ser generosos con el cliente
            proratedClasses[type] = Math.ceil(count * proportion);
          });
          
          classesForPeriod = proratedClasses;
          
          logger.info(`Prorrateo calculado para ${userId}:`);
          logger.info(`  - Período: ${totalDaysInPeriod}/${daysInMonth} días (${(proportion * 100).toFixed(1)}%)`);
          logger.info(`  - Clases originales:`, planData.classesIncluded);
          logger.info(`  - Clases prorrateadas:`, proratedClasses);
        }
        
        // Preparar datos de suscripción con valores por defecto
          const subscriptionData = {
            stripeSubscriptionId: subscription.id,
            planType: planType,
            status: subscription.status,
            startDate: admin.firestore.Timestamp.fromDate(startDate),
            endDate: admin.firestore.Timestamp.fromDate(endDate),
            firstPaymentDate: admin.firestore.Timestamp.fromDate(new Date()),
            isProrated: isProrated,
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
            type: planData.type || "flex",
            classesLeftThisPeriod: classesForPeriod,
            reservationType: "flex"
          };

        // Actualizar usuario con merge para crear campos que no existen
        await userRef.set({
          ...currentUserData,
          subscription: subscriptionData,
          classCredits: currentUserData.classCredits || 0,
          hasClassCredits: currentUserData.hasClassCredits || false,
          classCreditsPacks: currentUserData.classCreditsPacks || [],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        logger.info(`Suscripción creada para usuario ${userId}, plan: ${planType}`);
        logger.info(`Clases asignadas:`, classesForPeriod);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.paused":
      case "customer.subscription.resumed": {
        const subscription = data;
        const stripeCustomerId = subscription.customer;

        const userSnap = await db.collection("users")
          .where("stripeCustomerId", "==", stripeCustomerId)
          .limit(1)
          .get();

        if (userSnap.empty) {
          logger.warn(`No se encontró usuario para Stripe customer ${stripeCustomerId}`);
          break;
        }

        const userDoc = userSnap.docs[0];
        const userRef = userDoc.ref;
        const currentUserData = userDoc.data();

        const startDate = subscription.current_period_start
          ? admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_start * 1000))
          : null;
        const endDate = subscription.current_period_end
          ? admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_end * 1000))
          : null;

        // Preservar datos existentes y solo actualizar campos de suscripción
        const updatedSubscription = {
          ...(currentUserData.subscription || {}),
          status: subscription.status,
          startDate: startDate,
          endDate: endDate,
          cancelAtPeriodEnd: subscription.cancel_at_period_end || false
        };

        await userRef.set({
          ...currentUserData,
          subscription: updatedSubscription,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        logger.info(`Suscripción actualizada para usuario ${userDoc.id}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = data;
        const stripeCustomerId = subscription.customer;

        const userSnap = await db.collection("users")
          .where("stripeCustomerId", "==", stripeCustomerId)
          .limit(1)
          .get();

        if (userSnap.empty) {
          logger.warn(`No se encontró usuario para Stripe customer ${stripeCustomerId}`);
          break;
        }

        const userDoc = userSnap.docs[0];
        const userRef = userDoc.ref;
        const currentUserData = userDoc.data();

        // Preservar subscription existente y solo actualizar status
        const updatedSubscription = {
          ...(currentUserData.subscription || {}),
          status: "canceled",
          stripeSubscriptionId: null
        };

        await userRef.set({
          ...currentUserData,
          subscription: updatedSubscription,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        logger.info(`Suscripción cancelada para usuario ${userDoc.id}`);
        break;
      }

      // ================= RENOVACIONES DE PERÍODO =================
      case "invoice.payment_succeeded": {
        const invoice = data;
        const stripeCustomerId = invoice.customer;

        // Solo procesar si es una factura de suscripción (no de pago único)
        if (!invoice.subscription) {
          logger.info("Invoice no es de suscripción, ignorando");
          break;
        }

        const userSnap = await db.collection("users")
          .where("stripeCustomerId", "==", stripeCustomerId)
          .limit(1)
          .get();

        if (userSnap.empty) {
          logger.warn(`No se encontró usuario para Stripe customer ${stripeCustomerId}`);
          
          // FALLBACK: Buscar por userId en metadata
          const userId = subscription.metadata?.userId;
          if (userId) {
            logger.info(`Intentando recuperar usuario por userId: ${userId}`);
            const userDocById = await db.collection("users").doc(userId).get();
            
            if (userDocById.exists) {
              // Usar este usuario y actualizar su stripeCustomerId
              userDoc = userDocById;
              userRef = userDocById.ref;
              await userRef.update({ stripeCustomerId: stripeCustomerId });
              logger.info(`Usuario recuperado y stripeCustomerId actualizado: ${userId}`);
            } else {
              logger.error(`Usuario no encontrado ni por customerId ni por userId: ${userId}`);
              break;
            }
          } else {
            logger.error(`No userId en metadata para recuperar usuario`);
            break;
          }
        }

        const userDoc = userSnap.docs[0];
        const userRef = userDoc.ref;
        const userData = userDoc.data();

        // Obtener datos del plan
        const planType = userData.subscription?.planType;
        if (!planType) {
          logger.warn(`No se encontró planType para usuario ${userDoc.id}`);
          break;
        }

        const planSnap = await db.collection("subscription_plans")
          .where("type", "==", planType)
          .limit(1)
          .get();

        if (!planSnap.empty) {
          const planData = planSnap.docs[0].data();
          
          // Preservar subscription existente y solo resetear clases
          const updatedSubscription = {
            ...(userData.subscription || {}),
            classesLeftThisPeriod: planData.classesIncluded || {},
            status: "active",
          };
          
          await userRef.set({
            ...userData,
            subscription: updatedSubscription,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });

          logger.info(`Clases reseteadas para nuevo período - Usuario: ${userDoc.id}`);
        }
        break;
      }

      // ================= PAGOS FALLIDOS =================
      case "invoice.payment_failed": {
        const invoice = data;
        const stripeCustomerId = invoice.customer;

        if (!invoice.subscription) break;

        const userSnap = await db.collection("users")
          .where("stripeCustomerId", "==", stripeCustomerId)
          .limit(1)
          .get();

        if (userSnap.empty) {
          logger.warn(`No se encontró usuario para Stripe customer ${stripeCustomerId}`);
          break;
        }

        const userDoc = userSnap.docs[0];
        const userRef = userDoc.ref;
        const userData = userDoc.data();

        // Preservar subscription y marcar como con pago fallido
        const updatedSubscription = {
          ...(userData.subscription || {}),
          status: "past_due",
        };

        await userRef.set({
          ...userData,
          subscription: updatedSubscription,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        logger.warn(`Pago fallido para usuario ${userDoc.id}`);
        break;
      }

      // ================= GESTIÓN DE CLIENTES =================
      case "customer.created": {
        const customer = data;
        const email = customer.email;
        const stripeCustomerId = customer.id;

        if (!email) {
          logger.warn("No email found in new Stripe customer");
          break;
        }

        // Buscar usuario por email
        const userSnap = await db.collection("users")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (!userSnap.empty) {
          const userRef = userSnap.docs[0].ref;
          const userData = userSnap.docs[0].data();
          
          await userRef.set({
            ...userData,
            stripeCustomerId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
          
          logger.info(`Stripe customer ID ${stripeCustomerId} guardado en usuario ${email}`);
        } else {
          logger.warn(`No se encontró usuario en Firestore con email ${email}`);
        }
        break;
      }

      case "customer.updated": {
        const customer = data;
        const stripeCustomerId = customer.id;
        const email = customer.email;

        if (!email) break;

        const userSnap = await db.collection("users")
          .where("stripeCustomerId", "==", stripeCustomerId)
          .limit(1)
          .get();

        if (!userSnap.empty) {
          const userRef = userSnap.docs[0].ref;
          const userData = userSnap.docs[0].data();
          
          await userRef.set({
            ...userData,
            email: email,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
          
          logger.info(`Customer updated for ${stripeCustomerId}`);
        }
        break;
      }

      // ================= PAGOS INDIVIDUALES =================
      case "payment_intent.payment_failed": {
        const paymentIntent = data;
        const customerId = paymentIntent.customer;
        const failureReason = paymentIntent.last_payment_error?.message || "Unknown error";
        
        logger.warn(`Pago fallido para customer ${customerId}: ${failureReason}`);
        break;
      }

      case "customer.subscription.trial_will_end": {
        const subscription = data;
        const userId = subscription.metadata?.userId;
        
        logger.info(`Trial terminará pronto para usuario ${userId}`);
        break;
      }

      // ================= PAGOS ÚNICOS (PACKS) =================
      case "checkout.session.completed": {
        const session = data;
        const userId = session.metadata?.userId;
        const mode = session.mode;

        if (!userId) {
          logger.warn("No userId en session.metadata");
          break;
        }

        if (mode === "payment") {
          // Es un pack de clases individuales
          const userRef = db.collection("users").doc(userId);
          const userDoc = await userRef.get();
          const userData = userDoc.exists ? userDoc.data() : {};

          const classesToAdd = parseInt(session.metadata?.classes || "1", 10);
          const packType = session.metadata?.planType || "individual";
          const stripePriceId = session.metadata?.stripePriceId || "";

          // Usar la nueva estructura de classCredits
          const previousCredits = userData.classCredits || 0;
          const newCredits = previousCredits + classesToAdd;

          const pack = {
            type: packType,
            price: session.amount_total / 100,
            stripePriceId,
            classes: classesToAdd,
            purchaseDate: admin.firestore.Timestamp.now(),
          };

          // Usar la nueva estructura simplificada
          const updatedUserData = {
            ...userData,
            classCredits: newCredits,
            hasClassCredits: newCredits > 0,
            classCreditsPacks: [...(userData.classCreditsPacks || []), pack],
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          await userRef.set(updatedUserData, { merge: true });

          logger.info(`Usuario ${userId} compró pack de ${classesToAdd} clases. Total créditos: ${newCredits}`);
        }
        break;
      }

      default:
        logger.info(`Evento no manejado: ${eventType}`);
    }

    response.json({ received: true });
  } catch (err) {
    logger.error("Error procesando evento de Stripe:", err);
    response.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
});