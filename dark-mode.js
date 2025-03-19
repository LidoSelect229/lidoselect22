const toggleButton = document.getElementById("toggle-dark-mode");

// Vérifier si le mode sombre est activé dans le stockage
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}

toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
});