let selectedCategories = new Set();
let placeMarkers = [];
let searchRadius = 3000;

async function fetchNearbyPlaces(lat, lon) {

    if (selectedCategories.size === 0) return;

    placeMarkers.forEach(marker => map.removeLayer(marker));
    placeMarkers = [];

    for (let category of selectedCategories) {

        let query = `
            [out:json];
            node["amenity"="${category}"]
            (around:${searchRadius}, ${lat}, ${lon});
            out;
        `;

        let response = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
                method: "POST",
                body: query
            }
        );

        let data = await response.json();

        data.elements.forEach(place => {

            let iconToUse = orangeIcon;
            if (category === "hotel") iconToUse = violetIcon;
            if (category === "cafe") iconToUse = brownIcon;

            let marker = L.marker([place.lat, place.lon], { icon: iconToUse })
                .addTo(map)
                .bindPopup(`
                    <b>${place.tags.name || "Unnamed"}</b><br>
                    ${category.toUpperCase()}
                `);

            placeMarkers.push(marker);
        });
    }
}

function setCategory(category) {

    const button = document.getElementById("btn-" + category);

    if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
        button.classList.remove("active");
    } else {
        selectedCategories.add(category);
        button.classList.add("active");
    }

    clearResults();

    if (window.lastDestinationLat && window.lastDestinationLon && selectedCategories.size > 0) {
        fetchNearbyPlaces(
            window.lastDestinationLat,
            window.lastDestinationLon
        );
    }
    const selectAllBtn = document.getElementById("selectAllBtn");

    if (selectedCategories.size === 3) {
        selectAllBtn.innerText = "Clear All";
    } else {
        selectAllBtn.innerText = "Select All";
    }
}
function toggleSelectAll() {

    const allCategories = ["restaurant", "hotel", "cafe"];
    const selectAllBtn = document.getElementById("selectAllBtn");

    if (selectedCategories.size === allCategories.length) {

        selectedCategories.clear();

        allCategories.forEach(cat => {
            document.getElementById("btn-" + cat)
                .classList.remove("active");
        });

        selectAllBtn.innerText = "Select All";

    } else {

        allCategories.forEach(cat => {
            selectedCategories.add(cat);
            document.getElementById("btn-" + cat)
                .classList.add("active");
        });

        selectAllBtn.innerText = "Clear All";
    }

    clearResults();

    if (window.lastDestinationLat && window.lastDestinationLon && selectedCategories.size > 0) {
        fetchNearbyPlaces(
            window.lastDestinationLat,
            window.lastDestinationLon
        );
    }
}

document.getElementById("radiusSlider").addEventListener("input", function () {

    searchRadius = parseInt(this.value);
    document.getElementById("radiusValue").innerText = searchRadius / 1000;

    clearResults();

    if (window.lastDestinationLat && window.lastDestinationLon && selectedCategories.size > 0) {
        fetchNearbyPlaces(window.lastDestinationLat, window.lastDestinationLon);
    }
});