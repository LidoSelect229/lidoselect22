self.addEventListener("push", function(event) {
    const options = {
        body: "Une nouvelle commande a été reçue !",
        icon: "/icon.png", // Icône de ton application
        badge: "/badge.png", // Petite icône pour les notifications
        sound: "https://www.myinstants.com/media/sounds/notification-sound.mp3" // Son de notification
    };
    event.waitUntil(
        self.registration.showNotification("LidoSelect", options)
    );
});