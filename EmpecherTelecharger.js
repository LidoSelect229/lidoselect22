
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    img.addEventListener('touchend', function (event) {
        event.preventDefault();
    });

    img.addEventListener('touchmove', function (event) {
        event.preventDefault();
    });
});
