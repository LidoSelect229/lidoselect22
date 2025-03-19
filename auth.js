

import { auth, db,  setDoc, doc, getDoc,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged } from "./firebase.js";

//☑️ fonction pour vérifier si un utilisateur est connecté 
async function verifierRoleUtilisateur() {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, "utilisateurs", user.uid));
    return userDoc.exists() ? userDoc.data().role : null;
}

// ✅ Fonction pour générer un code unique
function genererCodeParrainage(nom) {
    return nom.toUpperCase().replace(/\s+/g, '') + Math.floor(100 + Math.random() * 900);
}

// ✅ Inscription avec rôle "client" par défaut ,admin : manuellement ajouter dans Firestore 
// ✅ Inscription avec parrainage
async function inscrireUtilisateur(email, password, nom, telephone, adresse, codeParrain) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let codeParrainage = genererCodeParrainage(nom);
        let parrainId = null;

        // Vérifier si un code parrain est fourni et existe
        if (codeParrain) {
            const querySnapshot = await getDocs(collection(db, "utilisateurs"));
            querySnapshot.forEach((docSnap) => {
                if (docSnap.data().parrainCode === codeParrain) {
                    parrainId = docSnap.id;
                }
            });
        }

        await setDoc(doc(db, "utilisateurs", user.uid), {
            email,
            password,
            nom,
            telephone,
            adresse,
            role: "client",
            points: 0,
            parrainCode: codeParrainage,
            parrain: parrainId
        });

        alert("Inscription réussie !");
    } catch (error) {
        alert("Erreur : " + error.message);
    }
}

// ✅ Fonction pour se connecter
async function connexionUtilisateur(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Connexion réussie !");
    } catch (error) {
        alert("Erreur : " + error.message);
    }
}

// ✅ Fonction pour se déconnecter
async function deconnexionUtilisateur() {
    await signOut(auth);
    alert("Déconnexion réussie !");
}

// ✅ Vérifier si un utilisateur est connecté
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Utilisateur connecté :", user.email);
    } else {
        console.log("Aucun utilisateur connecté.");
    }
});

// ✅ Exporter les fonctions
export { inscrireUtilisateur, connexionUtilisateur, deconnexionUtilisateur, verifierRoleUtilisateur };

//récupére le rôle de l'utilisateur des qu'il se connecte 

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const role = await verifierRoleUtilisateur();
        if (role === "admin") {
            document.getElementById("admin-link").style.display = "block";
        } else {
            document.getElementById("admin-link").style.display = "none";
        }
    }
});
