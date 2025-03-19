import { db, auth, getAuth, createUserWithEmailAndPassword, doc, setDoc,  } from "./firebase.js"; 


// Sélectionner les éléments du formulaire
const form = document.getElementById("inscription-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const messageDiv = document.getElementById("message");

// Vérification de la force du mot de passe
passwordInput.addEventListener("input", function () {
    const strengthText = document.getElementById("password-strength");
    const password = passwordInput.value;

    if (password.length < 6) {
        strengthText.textContent = "Mot de passe trop court (6 caractères min)";
        strengthText.style.color = "red";
    } else if (!/[A-Z]/.test(password)) {
        strengthText.textContent = "Ajoutez au moins une majuscule";
        strengthText.style.color = "orange";
    } else if (!/\d/.test(password)) {
        strengthText.textContent = "Ajoutez au moins un chiffre";
        strengthText.style.color = "orange";
    } else {
        strengthText.textContent = "Mot de passe sécurisé";
        strengthText.style.color = "green";
    }
});

// Fonction pour afficher ou masquer le mot de passe
window.togglePasswordVisibility = function(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🙈"; // Emoji yeux ouverts
    } else {
        input.type = "password";
        icon.textContent = "👁️"; // Emoji œil
    }
};

// Gérer l'inscription
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        messageDiv.textContent = "Les mots de passe ne correspondent pas";
        messageDiv.style.color = "red";
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("✅ Utilisateur créé :", user.uid); // Debugging

        // Ajouter les informations dans Firestore
        await setDoc(doc(db, "utilisateurs", user.uid), {
            email: email,
            role: "client",
            dateCreation: new Date().toISOString()
        });

        console.log("✅ Utilisateur ajouté à Firestore !");
        messageDiv.textContent = "Inscription réussie ! Redirection...";
        messageDiv.style.color = "green";

        setTimeout(() => {
            window.location.href = "compte.html";
        }, 2000);

    } catch (error) {
        console.error("❌ Erreur Firebase :", error);
        messageDiv.textContent = "Erreur : " + error.message;
        messageDiv.style.color = "red";
    }
});
