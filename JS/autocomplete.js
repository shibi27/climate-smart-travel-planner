const autocompleteCache = {};

async function setupAutocomplete(inputId, boxId) {

    const input = document.getElementById(inputId);
    const box = document.getElementById(boxId);

    input.addEventListener("input", async function () {

        const query = input.value.trim().toLowerCase();

        if (query.length < 3) {
            box.classList.add("hidden");
            return;
        }

        if (autocompleteCache[query]) {
            renderSuggestions(autocompleteCache[query]);
            return;
        }

        try {

            let response = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
            );

            if (!response.ok) throw new Error("Autocomplete failed");

            let data = await response.json();

            autocompleteCache[query] = data.features;

            renderSuggestions(data.features);

        } catch (error) {
            console.error("Autocomplete error:", error);
        }

        function renderSuggestions(features) {

            box.innerHTML = "";

            features.forEach(place => {

                let name = place.properties.name || "";
                let city = place.properties.city || "";
                let country = place.properties.country || "";

                let displayName = [name, city, country]
                    .filter(Boolean)
                    .join(", ");

                let div = document.createElement("div");
                div.className = "suggestion-item";
                div.innerText = displayName;

                div.onclick = () => {
                    input.value = displayName;
                    box.classList.add("hidden");
                    clearResults();
                    validateInputs();
                };

                box.appendChild(div);
            });

            box.classList.remove("hidden");
        }
    });
}               

setupAutocomplete("yourLocation", "fromSuggestions");
setupAutocomplete("destination", "toSuggestions");