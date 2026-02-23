let fromMarker;
let toMarker;
let routeLine;
var map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function clearResults() {

    const output = document.getElementById("output");
    const button = document.getElementById("generateButton");

    function shrinkAndRemove(marker) {
        if (!marker || !marker._icon) return;

        marker._icon.style.transition = "transform 0.3s ease, opacity 0.3s ease";
        marker._icon.style.transform = "scale(0)";
        marker._icon.style.opacity = "0";

        setTimeout(() => {
            map.removeLayer(marker);
        }, 300);
    }

    if (fromMarker) {
        shrinkAndRemove(fromMarker);
        fromMarker = null;
    }

    if (toMarker) {
        shrinkAndRemove(toMarker);
        toMarker = null;
    }

    placeMarkers.forEach(marker => shrinkAndRemove(marker));
    placeMarkers = [];

    if (routeLine) {
        let opacity = 1;

        const fadeInterval = setInterval(() => {
            opacity -= 0.1;
            routeLine.setStyle({ opacity: opacity });

            if (opacity <= 0) {
                clearInterval(fadeInterval);
                map.removeLayer(routeLine);
                routeLine = null;
            }
        }, 30);
    }

    if (output.innerHTML.trim() !== "") {
        output.classList.add("fade-out");

        setTimeout(() => {
            output.classList.remove("fade-out");
            output.innerHTML = `
                <div class="update-message">
                    🔄 Plan updated. Please regenerate.
                </div>
            `;
        }, 400);
    }

    button.classList.add("regen-needed");

    map.flyTo([20.5937, 78.9629], 5, {
        duration: 1.2
    });
}