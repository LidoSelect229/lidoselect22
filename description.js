import { db, collection, getDoc, doc, addDoc } from "./firebase.js";

// Fonction pour récupérer l'ID du produit à partir de l'URL
function getProduitIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Récupère l'ID du produit depuis l'URL (ex : description.html?id=123)
}

// Fonction pour récupérer les détails du produit depuis Firestore
async function fetchProduitDetails() {
    const produitId = getProduitIdFromURL();

    if (!produitId) {
        console.error("ID du produit non trouvé dans l'URL.");
        document.getElementById("produit-details").innerHTML = "<p>Produit introuvable.</p>";
        return;
    }

    try {
        const produitDoc = await getDoc(doc(db, "produits", produitId));

        if (!produitDoc.exists()) {
            console.error("Produit non trouvé dans Firestore.");
            document.getElementById("produit-details").innerHTML = "<p>Produit introuvable.</p>";
            return;
        }

        const produit = produitDoc.data();
        afficherProduit(produit);
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        document.getElementById("produit-details").innerHTML = "<p>Erreur de chargement du produit.</p>";
    }
}

// Fonction pour afficher les détails du produit dans le DOM
function afficherProduit(produit) {
    const produitContainer = document.getElementById("produit-details");

    // Convertir les chaînes en tableaux si elles existent
    const imagesSuppArray = produit.imagesSupp ? produit.imagesSupp.split(',') : [];
    const videosArray = produit.videos ? produit.videos.split(',') : [];

    produitContainer.innerHTML = `
        <h2>${produit.nom}</h2>
        
         <div class="gallery-container">
            ${imagesSuppArray.length > 0 ? imagesSuppArray.map(img => `
                <img src="${img.trim()}" alt="Photo du produit">
            `).join('') : "<p>Aucune image supplémentaire</p>"}
        </div>
        <p id="image-counter">1 / ${imagesSuppArray.length}</p> <!-- Compteur dynamique -->
        
        <p>${produit.description}</p>
        
        <div id="ImagePrincipale">
            <img src="${produit.imageURL}" alt="${produit.nom}">
        </div>
        
        <div class="prix">
            <p class="prix-original"><strong>Prix :</strong> ${produit.prixOriginal} FCFA</p>
        <p class="prix-actuel"><strong>Prix :</strong> ${produit.prix} FCFA</p>
        </div>
        
        <button id="ajouter-au-panier">Ajouter au panier</button>

        <h3>Vidéo du produit</h3>
        <div id="videos">
            ${videosArray.length > 0 ? videosArray.map(video => `
                <video autoplay 
                loop 
                muted 
                playsinline 
                disablePictureInPicture 
                controlsList="nodownload nofullscreen noremoteplayback" 
                style="pointer-events: none; width: 100%;">
                    <source  src="${video.trim()}" type="video/mp4">
                    Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
            `).join('') : "<p>Aucune vidéo disponible</p>"}
        </div>
        
        <p>${produit.description1}</p>
    `;

    // Ajouter un écouteur d'événement pour le bouton "Ajouter au panier"
    document.getElementById("ajouter-au-panier").addEventListener("click", function() {
        ajouterAuPanier(produit.nom, produit.prixOriginal, produit.prix, produit.imageURL);
    });

    // Gérer le compteur dynamique pour les images
    const gallery = document.querySelector(".gallery-container");
    const images = document.querySelectorAll(".gallery-container img");
    const counter = document.getElementById("image-counter");

    gallery.addEventListener("scroll", function() {
        const scrollLeft = gallery.scrollLeft;
        const imageWidth = images[0].clientWidth;
        const currentIndex = Math.round(scrollLeft / imageWidth);
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    });
}

// Fonction pour ajouter le produit au panier (ici exemple avec alert)
async function ajouterAuPanier(nom, prixOriginal, prix, image) {
    try {
        const panierRef = collection(db, "panier");
        await addDoc(panierRef, {
            nom: nom,
            prixOriginal: prixOriginal ? prixOriginal: null,
            prix: prix,
            image: image,
            quantite: 1
        });
        alert(`Ajouté au panier : ${nom} - ${prix} FCFA`);
        
        // Rediriger vers la page du panier
        window.location.href = "panier.html";
    } catch (error) {
        console.error("Erreur lors de l'ajout au panier : ", error);
    }
}

// Lancer la récupération des détails du produit à l'ouverture de la page
fetchProduitDetails();
