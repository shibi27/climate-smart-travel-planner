let selectedCategories = new Set();
let placeMarkers = [];
let searchRadius = 3000;

const OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter"
];

async function fetchNearbyPlaces(lat, lon) {

    if (selectedCategories.size === 0) return;

    placeMarkers.forEach(marker => map.removeLayer(marker));
    placeMarkers = [];

    for (let category of selectedCategories) {

        const query = `
[out:json][timeout:25];
node["amenity"="${category}"](around:${searchRadius},${lat},${lon});
out;
`;

        let data = null;

        for (const server of OVERPASS_SERVERS) {

            try {

                console.log("Trying:", server);

                const response = await fetch(server, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: query
                });

                if (!response.ok) {
                    console.warn(`${server} returned ${response.status}`);
                    continue;
                }

                data = await response.json();

                console.log(
                    `${server} returned ${data.elements.length} ${category}(s)`
                );

                break;

            } catch (err) {

                console.error(`${server} failed`, err);

            }
        }

        if (!data || !data.elements) {
            console.error("All Overpass servers failed.");
            continue;
        }

        data.elements.forEach(place => {

            let iconToUse = orangeIcon;

            if (category === "hotel")
                iconToUse = violetIcon;

            if (category === "cafe")
                iconToUse = brownIcon;

            const marker = L.marker(
                [place.lat, place.lon],
                { icon: iconToUse }
            )
                .addTo(map)
                .bindPopup(`
                    <b>${place.tags.name || "Unnamed"}</b><br>
                    ${category.toUpperCase()}
                `);

            placeMarkers.push(marker);

        });
    }

    console.log("Nearby markers added:", placeMarkers.length);
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

    if (window.lastDestinationLat &&
        window.lastDestinationLon &&
        selectedCategories.size > 0) {

        fetchNearbyPlaces(
            window.lastDestinationLat,
            window.lastDestinationLon
        );
    }

    const selectAllBtn = document.getElementById("selectAllBtn");

    selectAllBtn.innerText =
        selectedCategories.size === 3
            ? "Clear All"
            : "Select All";
}

function toggleSelectAll() {

    const allCategories = ["restaurant", "hotel", "cafe"];
    const selectAllBtn = document.getElementById("selectAllBtn");

    if (selectedCategories.size === allCategories.length) {

        selectedCategories.clear();

        allCategories.forEach(cat =>
            document.getElementById("btn-" + cat)
                .classList.remove("active")
        );

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

    if (window.lastDestinationLat &&
        window.lastDestinationLon &&
        selectedCategories.size > 0) {

        fetchNearbyPlaces(
            window.lastDestinationLat,
            window.lastDestinationLon
        );
    }
}

document.getElementById("radiusSlider")
    .addEventListener("input", function () {

        searchRadius = parseInt(this.value);

        document.getElementById("radiusValue").innerText =
            searchRadius / 1000;

        clearResults();

        if (window.lastDestinationLat &&
            window.lastDestinationLon &&
            selectedCategories.size > 0) {

            fetchNearbyPlaces(
                window.lastDestinationLat,
                window.lastDestinationLon
            );
        }
    });
