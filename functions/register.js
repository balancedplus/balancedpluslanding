const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

const db = admin.firestore();

exports.registerUser = functions.https.onCall(async (data, context) => {

  let customToken;
  try {

    const payload = data.data || data
    const {
      email,
      password,
      confirmPassword,
      name,
      surname,
      birthDate,
      gender,
      phoneNumber,
      zipCode,
    } = payload;

    console.log("Datos recibidos:", JSON.stringify(payload, null, 2));

    // --- Validaciones básicas ---
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    const phoneRegex = /^(6|7|8|9)\d{8}$/;

   if (!emailRegex.test(email)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Correo electrónico no válido",
        "auth/invalid-email"
      );
    }

    if (password !== confirmPassword) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Las contraseñas no coinciden",
        "auth/passwords-do-not-match"
      );
    }

    if (!phoneRegex.test(phoneNumber)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Número de teléfono no válido",
        "auth/invalid-phone-number"
      );
    }
    
    // --- Crear usuario en Auth ---
    console.log ("[REGISTER_FUNCTION] - Se crea el usuario en Auth para " + email)
    let userRecord;

    try {
    userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: `${name} ${surname}`,
    });
    } catch (err) {
      console.error("Error creando usuario en Auth:", err);

      // Mapeo de errores comunes del Admin SDK
      switch (err.code) {
          case "auth/email-already-exists":
          throw new functions.https.HttpsError(
            "already-exists",
            "El correo ya está registrado",
            "auth/email-already-in-use"
          );
        case "auth/invalid-password":
          throw new functions.https.HttpsError(
            "invalid-argument",
            "La contraseña no es válida",
            "auth/weak-password"
          );
        case "auth/invalid-email":
          throw new functions.https.HttpsError(
            "invalid-argument",
            "El correo no es válido",
            "auth/invalid-email"
          );
        default:
          throw new functions.https.HttpsError(
            "internal",
            "Error interno al crear usuario",
            err.code || "auth/internal-error"
          );
      }
    }

    // --- Crear doc en Firestore ---
    console.log ("[REGISTER_FUNCTION] - Se crea el doc en Firestore para " + email )
    const userRef = db.collection("users").doc(userRecord.uid);

    try {
        await db.runTransaction(async (t) => {
            const snap = await t.get(userRef);
            if (snap.exists) {
            throw new functions.https.HttpsError(
                "already-exists",
                "El usuario ya existe en Firestore"
            );
            }

            t.set(userRef, {
            uid: userRecord.uid,
            email,
            displayName: `${name} ${surname}`,
            name,
            surname,
            birthDate: birthDate ? new Date(birthDate) : null,
            gender: gender || "",
            phoneNumber,
            zipCode: zipCode || "",
            role: "user",
            signInProvider: "password",
            classesLeftThisPeriod: { barre: 0, funcional: 0, pilates: 0, yoga: 0 },
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            });
        });

        customToken = await admin.auth().createCustomToken(userRecord.uid);

        } catch (err) {
        // Rollback: eliminar Auth si falla Firestore
        console.error("Error al crear Firestore, se elimina Auth:", err);
        if (userRecord?.uid) {
            await admin.auth().deleteUser(userRecord.uid).catch(console.error);
        }
        throw new functions.https.HttpsError(err.code || "internal", err.message);
        }

        console.log ("[REGISTER_FUNCTION] - Todo correcto, Auth y Firestore para " + name + " " + surname + " - " + email)

    // --- TODO: Email de verificación ---
    // Firebase Admin SDK no envía correos de verificación directamente.
    // Normalmente se hace desde el cliente usando user.sendEmailVerification().
    // Si quieres forzarlo desde el back, hay que montar un link de verificación:
    // const link = await admin.auth().generateEmailVerificationLink(email);

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      customToken,
    };
    

  } catch (err) {
    console.error("Error en registerUser:", err);
    if (err instanceof functions.https.HttpsError) {
      throw err;
    }
    throw new functions.https.HttpsError("internal", err.message);
  }
});
