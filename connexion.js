import { getAuth, auth, signInWithEmailAndPassword } from "./firebase.js";

// Gestion de la soumission du formulaire de connexion
document.getElementById("connexion-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Connexion réussie !");
        window.location.href = "compte.html";  // Redirection vers la page compte
    } catch (error) {
        alert("Erreur de connexion : " + error.message);
    }
});

// Fonction pour afficher/masquer le mot de passe
document.getElementById('toggle-password').addEventListener('click', function() {
    var passwordField = document.getElementById('password');
    var passwordFieldType = passwordField.type;

    // Si le champ est en type "password", on le change en "text", sinon on le remet en "password"
    if (passwordFieldType === "password") {
        passwordField.type = "text";
        this.textContent = "🙈"; // Change l'icône en "masquer"
    } else {
        passwordField.type = "password";
        this.textContent = "👁️"; // Change l'icône en "afficher"
    }
});
