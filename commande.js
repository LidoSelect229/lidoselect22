

import { db, collection, getDocs, query, where } from "./firebase.js";


console.log("✅ Fichier commande.js chargé !");

async function afficherCommande() {
    const params = new URLSearchParams(window.location.search);
    const telephone = params.get("telephone");

    if (!telephone) {
        document.getElementById("commande-details").innerHTML = "<p>Aucune commande trouvée.</p>";
        return;
    }

    const commandesRef = collection(db, "commandes");
    const q = query(commandesRef, where("telephone", "==", telephone));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        document.getElementById("commande-details").innerHTML = "<p>Aucune commande trouvée.</p>";
        return;
    }

    let contenu = "<h2>Détails de votre commande :</h2>";
    querySnapshot.forEach((doc) => {
        const commande = doc.data();
        contenu += `
            <p><strong>Nom :</strong> ${commande.nom}</p>
            <p><strong>Téléphone :</strong> ${commande.telephone}</p>
            <p><strong>Adresse :</strong> ${commande.adresse}</p>
            <p><strong>Heure de Livraison :</strong> ${commande.heureLivraison}</p>
            <p><strong>Total :</strong> ${commande.total} FCFA</p>
            <h3>Produits commandés :</h3>
            <ul>
        `;
        commande.produits.forEach(produit => {
            contenu += `<li>${produit.nom} - ${produit.quantite} x ${produit.prix} FCFA</li>`;
        });
        contenu += `</ul>`;
    });

    document.getElementById("commande-details").innerHTML = contenu;
}

afficherCommande();


//rechercher commandes
// Fonction pour rechercher les commandes par téléphone
window.rechercherCommandes = async function rechercherCommandes() {
    const telephone = document.getElementById("search-phone").value.trim();

    if (!telephone) {
        alert("Veuillez entrer un numéro de téléphone.");
        return;
    }

    const commandesSnapshot = await getDocs(collection(db, "commandes"));
    const commandesContainer = document.getElementById("commandes-container");
    commandesContainer.innerHTML = ""; // Réinitialise l'affichage

    let commandesTrouvees = false;

    commandesSnapshot.forEach((doc) => {
        const commande = doc.data();
        if (commande.telephone === telephone) {
            commandesTrouvees = true;
            const commandeElement = document.createElement("div");
            commandeElement.classList.add("commande");
            commandeElement.innerHTML = `
                <h3>Commande #${doc.id}</h3>
                <p><strong>Nom :</strong> ${commande.nom}</p>
                <p><strong>Téléphone :</strong> ${commande.telephone}</p>
                <p><strong>Adresse :</strong> ${commande.adresse}</p>
                <p><strong>Total :</strong> ${commande.total} FCFA</p>
                <ul>
                    ${commande.produits.map(prod => `<li>${prod.nom} - ${prod.quantite} x ${prod.prix} FCFA</li>`).join("")}
                </ul>
            `;
            commandesContainer.appendChild(commandeElement);
        }
    });

    if (!commandesTrouvees) {
        commandesContainer.innerHTML = "<p>Aucune commande trouvée pour ce numéro.</p>";
    }
}
