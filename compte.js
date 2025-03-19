import { db, getAuth, auth, onAuthStateChanged, signOut, doc, setDoc, getDoc, getStorage, ref, uploadBytes, getDownloadURL } from "./firebase.js";


const userEmailSpan = document.getElementById("user-email");
const profilForm = document.getElementById("profil-form");
const profileImg = document.getElementById("profile-img");
const profileInput = document.getElementById("profile-input");
const uploadBtn = document.getElementById("upload-btn");

// Vérifier si l'utilisateur est connecté
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userEmailSpan.textContent = user.email;

        // Charger les données du profil
        const docRef = doc(db, "utilisateurs", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("nom").value = data.nom || "";
            document.getElementById("telephone").value = data.telephone || "";
            document.getElementById("adresse").value = data.adresse || "";
            if (data.photoURL) {
                profileImg.src = data.photoURL;
            }
        }
    } else {
        window.location.href = "connexion.html";
    }
});

// Enregistrer le profil utilisateur
profilForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("nom").value;
    const telephone = document.getElementById("telephone").value;
    const adresse = document.getElementById("adresse").value;

    if (!nom || !telephone || !adresse) {
        alert("Tous les champs sont obligatoires !");
        return;
    }

    await setDoc(doc(db, "utilisateurs", auth.currentUser.uid), {
        nom, telephone, adresse
    }, { merge: true });

    alert("Profil mis à jour !");
});


// Upload de la photo de profil vers Imgur


// Remplacer le code d'upload Firebase par le code d'upload sur Imgur

uploadBtn.addEventListener("click", async () => {
    const file = profileInput.files[0];
    if (!file) {
        alert("Veuillez sélectionner une image !");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: "Client-ID d3f7e134f7a7315", // Ton ID client Imgur
            },
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            const photoURL = data.data.link; // URL de la photo sur Imgur

            // Mise à jour de Firestore (si tu veux aussi enregistrer la photo dans Firestore)
            await setDoc(doc(db, "utilisateurs", auth.currentUser.uid), { photoURL }, { merge: true });

            // Mise à jour de l'affichage
            profileImg.src = photoURL;
            alert("Photo mise à jour !");
        } else {
            throw new Error(data.data.error);
        }
    } catch (error) {
        alert("Erreur lors de l'upload : " + error.message);
    }
});

// Déconnexion
window.logout = function() {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
};






// Fonction pour afficher la première lettre de l'email dans un cercle
function afficherInitialeEmail(email) {
  const initiale = email.charAt(0).toUpperCase(); // Récupérer la première lettre et la mettre en majuscule
  const userPhotoContainer = document.getElementById("user-photo-container");

  // Créer un élément div pour afficher la première lettre dans un cercle
  const initialeElement = document.createElement("div");
  initialeElement.classList.add("user-initial");
  initialeElement.textContent = initiale;

  // Ajouter l'élément dans le conteneur
  userPhotoContainer.innerHTML = "";  // Réinitialiser le contenu du conteneur
  userPhotoContainer.appendChild(initialeElement);
}
