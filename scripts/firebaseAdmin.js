// scripts/firebaseAdmin.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { resolve } from "path";

// Ruta al JSON que descargaste
const serviceAccountPath = resolve("./scripts/balancedplus-firebase-adminsdk-fbsvc-03082c1de6.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();

if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
}