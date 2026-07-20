let selectedCategories = new Set();
let placeMarkers = [];
let searchRadius = 3000;

async function fetchNearbyPlaces(lat, lon) {

    if (selectedCategories.size === 0) return;

    placeMarkers.forEach(marker => map.removeLayer(marker));
    placeMarkers = [];

    for (let category of selectedCategories) {

        try {

            const response = await fetch("/api/places", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    lat,
                    lon,
                    radius: searchRadius,
                    category
                })
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("API Error:", error);
                continue;
            }

            const data = await response.json();

            if (!data.features || data.features.length === 0) {
                console.log(`No ${category} found.`);
                continue;
            }

            data.features.forEach(place => {

                const coords = place.geometry.coordinates;
                const props = place.properties;

                let iconToUse = orangeIcon;

                if (category === "hotel") {
                    iconToUse = violetIcon;
                } else if (category === "cafe") {
                    iconToUse = brownIcon;
                }

                const marker = L.marker(
                    [coords[1], coords[0]],
                    { icon: iconToUse }
                )
                .addTo(map)
                .bindPopup(`
                    <b>${props.name || "Unnamed"}</b><br>
                    ${category.toUpperCase()}<br>
                    ${props.address_line2 || ""}
                `);

                placeMarkers.push(marker);

            });

        } catch (err) {
            console.error("Fetch failed:", err);
        }
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

    if (
        window.lastDestinationLat &&
        window.lastDestinationLon &&
        selectedCategories.size > 0
    ) {
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
            document
                .getElementById("btn-" + cat)
                .classList.remove("active");
        });

        selectAllBtn.innerText = "Select All";

    } else {

        allCategories.forEach(cat => {
            selectedCategories.add(cat);
            document
                .getElementById("btn-" + cat)
                .classList.add("active");
        });

        selectAllBtn.innerText = "Clear All";
    }

    clearResults();

    if (
        window.lastDestinationLat &&
        window.lastDestinationLon &&
        selectedCategories.size > 0
    ) {
        fetchNearbyPlaces(
            window.lastDestinationLat,
            window.lastDestinationLon
        );
    }
}

document
    .getElementById("radiusSlider")
    .addEventListener("input", function () {

        searchRadius = parseInt(this.value);

        document.getElementById("radiusValue").innerText =
            searchRadius / 1000;

        clearResults();

        if (
            window.lastDestinationLat &&
            window.lastDestinationLon &&
            selectedCategories.size > 0
        ) {
            fetchNearbyPlaces(
                window.lastDestinationLat,
                window.lastDestinationLon
            );
        }
    });