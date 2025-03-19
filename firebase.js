// Importer Firebase et les services nécessaires
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { 
    getFirestore, collection, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, doc,serverTimestamp, query, where, onSnapshot, orderBy, limit
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { 
    getStorage, ref, uploadBytes, getDownloadURL, deleteObject 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-storage.js";
import { 
    getAnalytics 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";


// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDIcnEpV0EU7FCLh5gT9xwVDOudm7mbGY4",
    authDomain: "lidoselect-22981.firebaseapp.com",
    projectId: "lidoselect-22981",
    storageBucket: "lidoselect-22981.appspot.com",  // ✅ Correction de l'URL
    messagingSenderId: "496280839349",
    appId: "1:496280839349:web:2e9c59b3e2cbd9dbfecafc",
    measurementId: "G-GHPCPF9BYM"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Base de données Firestore
const auth = getAuth(app); // Authentification
const storage = getStorage(app); // Stockage des fichiers
const analytics = getAnalytics(app); // Google Analytics



if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}


// 🔹 Gestion d'erreur pour Firebase Analytics
try {
    const analytics = getAnalytics(app);
    console.log("Firebase Analytics chargé avec succès !");
} catch (error) {
    console.warn("⚠️ Firebase Analytics n'a pas pu être chargé :", error);
}


// Exporter toutes les fonctionnalités Firebase nécessaires
export { 
    app, db, auth, storage, analytics, 
    collection, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, doc,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
    ref, uploadBytes, getDownloadURL, deleteObject, serverTimestamp, query, where, getAuth, onSnapshot, orderBy, getStorage, limit
};
