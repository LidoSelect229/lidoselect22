import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "./firebase.js";

const panierContainer = document.getElementById("panier-container");
const totalPriceElement = document.getElementById("total-price");
const finaliserCommandeButton = document.getElementById("finaliser-commande");
const formCommande = document.getElementById("form-commande");

async function afficherPanier() {
    const panierSnapshot = await getDocs(collection(db, "panier"));
    panierContainer.innerHTML = ''; // Réinitialiser le contenu du panier
    let total = 0;

    panierSnapshot.forEach((doc) => {
        const produit = doc.data();
        const produitElement = document.createElement("div");
        produitElement.classList.add("produit-panier");
        produitElement.innerHTML = `
            <img src="${produit.image}" alt="${produit.nom}">
            <h3>${produit.nom}</h3>
            <div class="prix">
                <p class="prix-original">Prix: ${produit.prixOriginal} FCFA</p>
                <p class="prix-actuel">Prix: ${produit.prix} FCFA</p>
            </div>
            <p>Quantité: <input type="number" value="${produit.quantite}" min="1" data-id="${doc.id}" class="quantite-input"></p>
            <button class="supprimer-btn" data-id="${doc.id}">Supprimer</button>
        `;
        panierContainer.appendChild(produitElement);
        total += produit.prix * produit.quantite;
    });

    totalPriceElement.textContent = `${total} FCFA`;
    ajouterEvenementsQuantite();
    ajouterEvenementsSuppression();
}

function ajouterEvenementsQuantite() {
    const quantiteInputs = document.querySelectorAll(".quantite-input");
    quantiteInputs.forEach(input => {
        input.addEventListener("change", (event) => {
            const id = event.target.getAttribute("data-id");
            const nouvelleQuantite = parseInt(event.target.value);
            if (nouvelleQuantite > 0) {
                mettreAJourQuantite(id, nouvelleQuantite);
            } else {
                alert("La quantité doit être supérieure à zéro.");
                event.target.value = 1;
            }
        });
    });
}

function ajouterEvenementsSuppression() {
    const boutonsSupprimer = document.querySelectorAll(".supprimer-btn");
    boutonsSupprimer.forEach(button => {
        button.addEventListener("click", (event) => {
            const id = event.target.getAttribute("data-id");
            supprimerDuPanier(id);
        });
    });
}

async function mettreAJourQuantite(id, quantite) {
    const produitRef = doc(db, "panier", id);
    try {
        await updateDoc(produitRef, { quantite: quantite });
        afficherPanier();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la quantité : ", error);
    }
}

async function supprimerDuPanier(id) {
    const produitRef = doc(db, "panier", id);
    try {
        await deleteDoc(produitRef);
        afficherPanier();
    } catch (error) {
        console.error("Erreur lors de la suppression du produit : ", error);
    }
}

async function viderPanier() {
    const panierSnapshot = await getDocs(collection(db, "panier"));
    panierSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });
    afficherPanier(); // Réinitialiser l'affichage après avoir vidé le panier
}

async function finaliserCommande(event) {
    event.preventDefault();

    // Récupérer les informations de livraison
    const nom = document.getElementById("nom").value;
    const telephone = document.getElementById("telephone").value;
    const adresse = document.getElementById("adresse").value;
    const heureLivraison = document.getElementById("heure-livraison").value;

    // Vérifier que le panier n'est pas vide
    const panierSnapshot = await getDocs(collection(db, "panier"));
    if (panierSnapshot.empty) {
        alert("Votre panier est vide.");
        return;
    }

    // Calculer le total et préparer les détails des produits
    let total = 0;
    const produits = [];
    panierSnapshot.forEach((doc) => {
        const produit = doc.data();
        total += produit.prix * produit.quantite;
        produits.push({
            nom: produit.nom,
            prix: produit.prix,
            quantite: produit.quantite
        });
    });

    // Créer une nouvelle commande
    try {
        await addDoc(collection(db, "commandes"), {
            nom: nom,
            telephone: telephone,
            adresse: adresse,
            heureLivraison: heureLivraison,
            produits: produits,
            total: total,
            date: new Date()
        });

        alert("Commande finalisée avec succès !");
        
       // Vider le panier
        viderPanier();

        // Rediriger vers la page de confirmation avec les infos de la commande
        window.location.href = `commande.html?telephone=${telephone}`;

    } catch (error) {
        console.error("Erreur lors de la finalisation de la commande : ", error);
        alert("Une erreur est survenue lors de la finalisation de votre commande. Veuillez réessayer.");
    }
}


// Ajouter l'événement au formulaire de commande
formCommande.addEventListener("submit", finaliserCommande);

// Charger les produits du panier au chargement de la page
afficherPanier();