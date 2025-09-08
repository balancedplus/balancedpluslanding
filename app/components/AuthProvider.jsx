// app/components/AuthProvider.jsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile, 
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  

  // Función para garantizar la existencia del doc user en Firestore
  async function ensureUserDoc(firebaseUser) {
    if (!firebaseUser) return;
    const uRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(uRef);
    if (!snap.exists()) {
      // crea doc mínimo
      await setDoc(uRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "",
        name: "",
        surname: "",
        phoneNumber: firebaseUser.phoneNumber || "",
        photoUrl: firebaseUser.photoURL || "",
        role: "user",
        signInProvider: firebaseUser.providerData?.[0]?.providerId || "password",
        classesLeftThisPeriod: { barre: 0, funcional: 0, pilates: 0, yoga: 0 },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (fbUser) => {

            if (fbUser) {
                await fbUser.reload(); // Asegura estado actualizado    
                const docRef =  doc(db, "users", fbUser.uid);
                const snap = await getDoc(docRef);
                if (!snap.exists()) {
                    await ensureUserDoc(fbUser);
                }
                setUser({
                    uid: fbUser.uid,
                    email: fbUser.email,
                    displayName: fbUser.displayName,
                    photoURL: fbUser.photoURL,
            });
            setIsVerified(true);

            } else {
            setUser(null);
            }
            setLoading(false);
        });

    return () => unsub();
    }, []);

    // Refrescar estado de verificación al volver a la pestaña
  useEffect(() => {
    const handleFocus = async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setIsVerified(true);
        setUser({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
        });
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Operaciones expuestas
 async function register({ email, password, name, surname, birthDate, gender, phoneNumber, zipCode }) {

    const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
        throw new Error("El correo electrónico ya está en uso.");
        }


  // Crear en Firebase Auth
  const uc = await createUserWithEmailAndPassword(auth, email, password);

  //  Actualizar displayName
  const displayName = `${name} ${surname}`;
  await updateProfile(uc.user, { displayName });

  //  Crear doc en Firestore con todos los datos
  const uRef = doc(db, "users", uc.user.uid);
  await setDoc(uRef, {
    uid: uc.user.uid,
    email,
    displayName,
    name,
    surname,
    birthDate: birthDate ? new Date(birthDate) : null,
    gender,
    phoneNumber,
    zipCode,
    role: "user",
    signInProvider: "password",
    classesLeftThisPeriod: { barre: 0, funcional: 0, pilates: 0, yoga: 0 },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: false });

  // TEMPORALMENTE FUERA
  
  //await sendEmailVerification(uc.user);

  return uc;
}


  async function login({ email, password }) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (err) {
        console.error("Error login:", err.message);
        throw err;
    }
}


  async function logout() {
    await signOut(auth);
  }

  const getFullUserData = async () => {
    if (!user) throw new Error("No hay usuario logueado");
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Usuario no encontrado en Firestore");
    return snap.data();
  };

  async function resendVerificationEmail() {
    if (!auth.currentUser) throw new Error("No hay usuario logueado");
    await sendEmailVerification(auth.currentUser);
  }

  const value = {
    user,
    loading,
    isVerified,
    register,
    login,
    logout,
    getFullUserData,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
