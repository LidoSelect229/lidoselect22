import { db, collection, getDocs, auth } from "./firebase.js";

// Sélection de la collection "produits"
const produitsContainer = document.getElementById("produits-container");

async function afficherProduits() {
    const produitsSnapshot = await getDocs(collection(db, "produits"));
    
    produitsSnapshot.forEach((doc) => {
        const produit = doc.data();
        
        const produitElement = document.createElement("div");
        produitElement.classList.add("produit");
        produitElement.innerHTML = `
            <img src="${produit.imageURL}" alt="${produit.nom}">
            <h3>${produit.nom}</h3>
            <div class="prix">   <p class="prix-original">Prix: ${produit.prixOriginal} FCFA</p>
            <p class="prix-actuel">Prix: ${produit.prix} FCFA</p>
            </div>
            <button onclick="voirDetails('${doc.id}')">Voir Détails</button>
        `;
        
        produitsContainer.appendChild(produitElement);
    });
}

// Fonction pour rediriger vers la page des détails avec l'ID du produit
window.voirDetails = function (id) {
    window.location.href = `description.html?id=${id}`;
};

// Charger les produits au chargement de la page
afficherProduits();
