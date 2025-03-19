import { db } from "./firebase.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const listeTemoignages = document.getElementById("liste-temoignages");

// ✅ Charger les témoignages depuis Firestore
async function afficherTemoignages() {
    const q = query(collection(db, "avis"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    listeTemoignages.innerHTML = "";
    querySnapshot.forEach((docSnap) => {
        const avis = docSnap.data();
        listeTemoignages.innerHTML += `
            <div class="temoignage">
                <strong>${avis.nomClient}</strong> - ${"⭐".repeat(avis.note)}
                <p>"${avis.commentaire}"</p>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", afficherTemoignages);