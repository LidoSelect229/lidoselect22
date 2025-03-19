 import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, limit, setDoc, getDoc } from "./firebase.js";

let produitEnCours = null; // Stocke l'ID du produit en modification




// Vérifier si le navigateur supporte les notifications
if ("serviceWorker" in navigator && "PushManager" in window) {
    navigator.serviceWorker.register("/sw.js").then(reg => {
        console.log("Service Worker enregistré !");
    }).catch(error => console.log("Erreur SW :", error));
}

// Demander la permission des notifications
function demanderPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Permission de notification accordée !");
        } else {
            console.log("Permission refusée.");
        }
    });
}

// Demander la permission au chargement
document.addEventListener("DOMContentLoaded", demanderPermission);

// Son de notification
const notificationSound = new Audio("https://www.myinstants.com/media/sounds/notification-sound.mp3");

// Vérifier si l'utilisateur est en ligne
function estEnLigne() {
    return navigator.onLine;
}

// Fonction pour écouter les nouvelles commandes en temps réel
function ecouterNouvellesCommandes() {
    const commandesRef = collection(db, "commandes");
    const q = query(commandesRef, orderBy("date", "desc"), limit(1));

    onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added" && estEnLigne()) {
                // Jouer le son
                notificationSound.play().catch(error => console.log("Erreur de lecture du son :", error));

                // Envoyer une notification push
                if (Notification.permission === "granted") {
                    navigator.serviceWorker.getRegistration().then(reg => {
                        if (reg) {
                            reg.showNotification("LidoSelect", {
                                body: "Une nouvelle commande a été reçue !",
                                icon: "/icon.png",
                                badge: "/badge.png",
                                sound: "https://www.myinstants.com/media/sounds/notification-sound.mp3"
                            });
                        }
                    });
                }
            }
        });
    });
}

// Activer l'écoute des commandes au chargement
document.addEventListener("DOMContentLoaded", () => {
    afficherCommandes();
    ecouterNouvellesCommandes();
});





// Fonction mise à jour pour afficher les produits
async function afficherProduits() {
    const produitRef = collection(db, "produits");
    const produitSnapshot = await getDocs(produitRef);
    const produits = produitSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    document.getElementById('produit-list').innerHTML = produits.map(produit => `
        <div class="product-item">
            <h3>${produit.nom}</h3>
            <p>${produit.description}</p>
            <img src="${produit.imageURL}" alt="Image principale">
            <div class="prix">
                <p class="prix-original">Prix original : ${produit.prixOriginal} FCFA</p>
                <p class="prix-actuel">Prix actuel : ${produit.prix} FCFA</p>
            </div>
            <div class="product-gallery">
                ${produit.imagesSupp ? produit.imagesSupp.split(',').map(img => `<img src="${img.trim()}" alt="Image supplémentaire">`).join('') : ""}
            </div>
            
            <p>${produit.description1}</p>
            
            <div class="product-videos">
                ${produit.videos ? produit.videos.split(',').map(video => `<video src="${video.trim()}" autoplay loop muted playsinline style="pointer-events: none; width: 100%;"></video>`).join('') : ""}
            </div>
            
      <button class="modifier" onclick="modifierProduit('${produit.id}', '${produit.nom.replace(/'/g, "\\'")}', '${produit.prixOriginal}', '${produit.prix}', \`${produit.description.replace(/`/g, "\\`")}\`,\`${produit.description1.replace(/`/g, "\\`")}\`, '${produit.imageURL}', '${produit.imagesSupp}', '${produit.videos}')">Modifier</button>
     <button class="supprimer" onclick="supprimerProduit('${produit.id}')">Supprimer</button>
        </div>
    `).join('');
}      
            
// Fonction pour modifier un produit


async function modifierProduit(id, nom, prixOriginal, prix, description, description1, imageURL, imagesSupp = "", videos = "") {
    produitEnCours = id; // Indique qu'on modifie un produit existant

    document.getElementById('product-name').value = nom;
    document.getElementById('product-priceOriginal').value = prixOriginal;
    document.getElementById('product-price').value = prix;
    document.getElementById('product-description').value = description;
      document.getElementById('product-description1').value = description1;
    document.getElementById('product-image').value = imageURL;
    document.getElementById('product-images').value = imagesSupp;
    document.getElementById('product-videos').value = videos;

    document.getElementById('product-form').style.display = 'block';
    document.getElementById('ajout-produit-form').scrollIntoView({ behavior: 'smooth' });

    // 🔥 Change le texte du bouton de soumission
    document.getElementById('submit-produit-btn').value = "Modifier le Produit";
    
}


document.getElementById('ajouter-produit-btn').addEventListener('click', () => {
    document.getElementById('product-form').style.display = 'block';
    document.getElementById('ajout-produit-form').reset();
    document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('ajout-produit-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    if (produitEnCours) {
        try {
            await updateDoc(doc(db, "produits", produitEnCours), {
                nom: document.getElementById('product-name').value,
                prixOriginal: document.getElementById('product-priceOriginal').value,
                prix: document.getElementById('product-price').value,
                description: document.getElementById('product-description').value,
                description1: document.getElementById('product-description1').value,
                imageURL: document.getElementById('product-image').value,
                imagesSupp: document.getElementById('product-images').value.trim(),
                videos: document.getElementById('product-videos').value.trim()
            });

            alert("Produit modifié avec succès !");
        } catch (error) {
            console.error("Erreur lors de la modification :", error);
        }

    } else {
        try {
            await addDoc(collection(db, "produits"), {
                nom: document.getElementById('product-name').value,
                prixOriginal: document.getElementById('product-priceOriginal').value,
                prix: document.getElementById('product-price').value,
                description: document.getElementById('product-description').value,
                 description1: document.getElementById('product-description1').value,
                imageURL: document.getElementById('product-image').value,
                imagesSupp: document.getElementById('product-images').value.trim(),
                videos: document.getElementById('product-videos').value.trim()
            });

            alert("Produit ajouté avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
        }
    }

    // Réinitialisation après l'action
    produitEnCours = null;
    
    

document.getElementById('ajout-produit-form').reset();

    // 🔥 Remettre le texte "Ajouter le Produit"
    document.getElementById('submit-produit-btn').value = "Ajouter le Produit";

    afficherProduits(); // Rafraîchir la liste des produits
    document.getElementById('product-form').style.display = 'none';
});


// Fonction pour supprimer un produit avec confirmation
async function supprimerProduit(id) {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        try {
            await deleteDoc(doc(db, "produits", id));
            console.log(`Produit ${id} supprimé avec succès.`);
            afficherProduits();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    }
}

// Rendre les fonctions accessibles globalement
window.modifierProduit = modifierProduit;
window.supprimerProduit = supprimerProduit;

// Chargement des produits au démarrage
document.addEventListener("DOMContentLoaded", afficherProduits);

  
//fonction supprimer commande et supprimer utilisateurs 
// Fonction pour supprimer une commande
async function supprimerCommande(id) {
    const confirmation = confirm("Voulez-vous vraiment supprimer cette commande ?");
    if (confirmation) {
        try {
            await deleteDoc(doc(db, "commandes", id));
            console.log(`Commande ${id} supprimée avec succès.`);
            afficherCommandes();  // Rafraîchir la liste des commandes après suppression
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    }
}





// Rendre accessible
window.supprimerCommande = supprimerCommande;



// Fonction pour afficher les commandes
// Fonction pour afficher les commandes avec plus de détails
async function afficherCommandes() {
    const commandeRef = collection(db, "commandes");
    const commandeSnapshot = await getDocs(commandeRef);
    const commandes = commandeSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    document.getElementById('commande-list').innerHTML = commandes.map(commande => `
        <div class="order-item">
            <h3>Commande de ${commande.nom}</h3>
            <p>Adresse: ${commande.adresse}</p>
            <p>Date de commande: ${new Date(commande.date.seconds * 1000).toLocaleString('fr-FR')}</p> <!-- Convertir la date de Firebase -->
            <p>Heure de livraison: ${commande.heureLivraison}</p>
            <p>Téléphone: ${commande.telephone}</p>
            
            <h4>Produits:</h4>
            <ul>
                ${commande.produits.map(produit => `
                    <li>
                        Nom: ${produit.nom} <br>
                        Quantité: ${produit.quantite} <br>
                        Prix: ${produit.prix} FCFA
                    </li>
                `).join('')}
            </ul>

            <p><strong>Total: ${commande.total} FCFA</strong></p>

            <button onclick="supprimerCommande('${commande.id}')">Supprimer</button>
        </div>
    `).join('');
}

// Chargement des données au démarrage
document.addEventListener("DOMContentLoaded",
    afficherCommandes);





// Fonction pour afficher les utilisateurs
// Fonction pour afficher les utilisateurs
async function afficherUtilisateurs() {
    const utilisateurRef = collection(db, "utilisateurs");
    const utilisateurSnapshot = await getDocs(utilisateurRef);
    const utilisateurs = utilisateurSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    if (utilisateurs.length === 0) {
        document.getElementById('utilisateur-list').innerHTML = "<p>Aucun utilisateur trouvé.</p>";
        return;
    }

    document.getElementById('utilisateur-list').innerHTML = utilisateurs.map(utilisateur => `
        <div class="user-item">
            <h3>${utilisateur.nom} (${utilisateur.role})</h3>
            <p>Email: ${utilisateur.email}</p>
            <p>Téléphone: ${utilisateur.telephone}</p>
            <p>Adresse: ${utilisateur.adresse}</p>
            <p>Date d'inscription: ${new Date(utilisateur.dateCreation).toLocaleString('fr-FR')}</p>

            ${utilisateur.role !== "admin" ? `
                <button onclick="promouvoirUtilisateur('${utilisateur.id}')">Promouvoir en admin</button>
                <button onclick="supprimerUtilisateur('${utilisateur.id}')">Supprimer</button>
            ` : '<p><strong>Admin - Ne peut pas être supprimé</strong></p>'}
        </div>
    `).join('');
}

// Fonction pour promouvoir un utilisateur en admin
async function promouvoirUtilisateur(id) {
    const confirmation = confirm("Voulez-vous vraiment promouvoir cet utilisateur en administrateur ?");
    if (confirmation) {
        try {
            await updateDoc(doc(db, "utilisateurs", id), { role: "admin" });
            alert("L'utilisateur a été promu en administrateur !");
            afficherUtilisateurs();
        } catch (error) {
            console.error("Erreur lors de la promotion :", error);
        }
    }
}

// Fonction pour supprimer un utilisateur (sauf admin)
async function supprimerUtilisateur(id) {
    const confirmation = confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (confirmation) {
        try {
            const utilisateurDoc = await getDocs(collection(db, "utilisateurs"));
            const utilisateur = utilisateurDoc.docs.find(doc => doc.id === id)?.data();

            if (utilisateur?.role === "admin") {
                alert("Impossible de supprimer un administrateur !");
                return;
            }

            await deleteDoc(doc(db, "utilisateurs", id));
            console.log(`Utilisateur ${id} supprimé avec succès.`);
            afficherUtilisateurs();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    }
}

// Rendre accessibles globalement
window.afficherUtilisateurs = afficherUtilisateurs;
window.supprimerUtilisateur = supprimerUtilisateur;
window.promouvoirUtilisateur = promouvoirUtilisateur;

// Charger les utilisateurs au démarrage
document.addEventListener("DOMContentLoaded", () => {
    afficherUtilisateurs();
});



//pixel

// Charger l'ID actuel au chargement
async function chargerPixelID() {
  const docRef = doc(db, "config", "siteConfig");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    document.getElementById('pixel-id').value = docSnap.data().pixelID;
  }
}
chargerPixelID();

// Mettre à jour l'ID Pixel
document.getElementById('pixel-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const pixelID = document.getElementById('pixel-id').value.trim();

  try {
    await setDoc(doc(db, "config", "siteConfig"), { pixelID });
    alert("ID Pixel enregistré !");
  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur lors de l'enregistrement !");
  }
});


