const geocodeCache = {};

async function generatePlan() {

    const button = document.getElementById("generateButton");

    try {

        button.innerHTML = `<div class="spinner"></div>`;
        button.disabled = true;

        let journeyDateDisplay = document.getElementById("journeyDate").value;

        if (!journeyDateDisplay) {
            alert("Please select a journey date!");
            button.innerHTML = "Generate Smart Plan";
            button.disabled = false;
            return;
        }

        if (!/^\d{2}-\d{2}-\d{4}$/.test(journeyDateDisplay)) {
            alert("Please enter date in DD-MM-YYYY format.");
            button.innerHTML = "Generate Smart Plan";
            button.disabled = false;

            return;
        }
        let parts = journeyDateDisplay.split("-");

        let journeyDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

        let fromCity = document.getElementById("yourLocation").value.trim();
        let toCity = document.getElementById("destination").value.trim();

        if (!fromCity || !toCity) {
            alert("Please enter both locations!");
            button.innerHTML = "Generate Smart Plan";
            button.disabled = false;
            return;
        }

        let fromKey = fromCity.toLowerCase();

        let fromLat, fromLon;

        if (geocodeCache[fromKey]) {

            ({ lat: fromLat, lon: fromLon } = geocodeCache[fromKey]);

        } else {

            let geoFrom = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(fromCity)}&limit=1`
            );

            if (!geoFrom.ok) throw new Error("From location fetch failed");

            let dataFrom = await geoFrom.json();

            if (!dataFrom.features.length) {
                alert("Your location not found!");
                button.innerHTML = "Generate Smart Plan";
                button.disabled = false;
                return;
            }

            fromLat = dataFrom.features[0].geometry.coordinates[1];
            fromLon = dataFrom.features[0].geometry.coordinates[0];

            geocodeCache[fromKey] = { lat: fromLat, lon: fromLon };
        }
        
        let toKey = toCity.toLowerCase();

        let toLat, toLon;

        if (geocodeCache[toKey]) {

            ({ lat: toLat, lon: toLon } = geocodeCache[toKey]);

        } else {

            let geoTo = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(toCity)}&limit=1`
            );

            if (!geoTo.ok) throw new Error("Destination fetch failed");

            let dataTo = await geoTo.json();

            if (!dataTo.features.length) {
                alert("Destination not found!");
                button.innerHTML = "Generate Smart Plan";
                button.disabled = false;
                return;
            }

            toLat = dataTo.features[0].geometry.coordinates[1];
            toLon = dataTo.features[0].geometry.coordinates[0];

            geocodeCache[toKey] = { lat: toLat, lon: toLon };
        }
        window.lastDestinationLat = toLat;
        window.lastDestinationLon = toLon;

        if (fromMarker) map.removeLayer(fromMarker);
        if (toMarker) map.removeLayer(toMarker);
        if (routeLine) map.removeLayer(routeLine);

        fromMarker = L.marker([fromLat, fromLon], {
            icon: redIcon,
            zIndexOffset: 900  
        })
            .addTo(map)
            .bindPopup("📍 " + fromCity);

        setTimeout(() => {
            if (fromMarker && fromMarker._icon) {
                fromMarker._icon.classList.add("marker-drop");
                fromMarker._icon.classList.add("source-glow");
            }
        }, 0);
        toMarker = L.marker([toLat, toLon], {
            icon: greenIcon,
            zIndexOffset: 1000
        })
            .addTo(map)
            .bindPopup("📍 " + toCity);

        setTimeout(() => {
            if (toMarker && toMarker._icon) {
                toMarker._icon.classList.add("marker-drop");
                toMarker._icon.classList.add("destination-glow");
            }
        }, 0);

        let routeResponse = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson`
        );

        let routeData = await routeResponse.json();

        if (routeData.code !== "Ok") {
            alert("Route not found!");
            button.innerHTML = "Generate Smart Plan";
            button.disabled = false;
            return;
        }

        routeLine = L.geoJSON(routeData.routes[0].geometry, {
            style: { color: '#00ff95', weight: 5 }
        }).addTo(map);

        map.fitBounds(routeLine.getBounds());

        let distance = routeData.routes[0].distance / 1000;
        let duration = routeData.routes[0].duration / 60;

        let weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${toLat}&longitude=${toLon}&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,precipitation_probability_max&timezone=auto`
        );

        let weatherData = await weatherResponse.json();

        let tempMin = "N/A";
        let tempMax = "N/A";
        let windSpeed = "N/A";
        let rainProb = "N/A";

        if (weatherData.daily && weatherData.daily.time.includes(journeyDate)) {

            let index = weatherData.daily.time.indexOf(journeyDate);

            tempMax = weatherData.daily.temperature_2m_max[index];
            tempMin = weatherData.daily.temperature_2m_min[index];
            windSpeed = weatherData.daily.windspeed_10m_max[index];
            rainProb = weatherData.daily.precipitation_probability_max[index];
        }

        let warningsHTML = "";

        if (tempMax !== "N/A" && tempMax > 38) {
            warningsHTML += `
                <div class="warning-card heatwave">
                    <div class="warning-left">
                        <div class="warning-icon">🔥</div>
                        <div>Heatwave Risk: High temperature expected</div>
                    </div>
                    <div class="badge">HIGH</div>
                </div>`;
        }

        if (windSpeed !== "N/A" && windSpeed > 40) {
            warningsHTML += `
                <div class="warning-card storm">
                    <div class="warning-left">
                        <div class="warning-icon">🌪</div>
                        <div>Storm Risk: Strong winds expected</div>
                    </div>
                    <div class="badge">MODERATE</div>
                </div>`;
        }

        if (rainProb !== "N/A" && rainProb > 60) {
            warningsHTML += `
                <div class="warning-card rain">
                    <div class="warning-left">
                        <div class="warning-icon">🌧</div>
                        <div>Heavy Rain Probability: ${rainProb}%</div>
                    </div>
                    <div class="badge">HIGH</div>
                </div>`;
        }

        document.body.classList.remove("heat-bg", "storm-bg");
        document.getElementById("rainEffect").classList.remove("rain-overlay");

        if (tempMax !== "N/A" && tempMax > 38)
            document.body.classList.add("heat-bg");

        if (windSpeed !== "N/A" && windSpeed > 40)
            document.body.classList.add("storm-bg");

        if (rainProb !== "N/A" && rainProb > 60)
            document.getElementById("rainEffect").classList.add("rain-overlay");

        document.getElementById("output").innerHTML = `
                            <div class="analysis-card">
                                <div class="analysis-header">📊 Smart Travel Analysis</div>

                                <div class="analysis-grid">
                                    <div class="analysis-item">
                                        <span class="analysis-icon">🛣</span>
                                        <div>
                                            <div class="analysis-label">Road Distance</div>
                                            <div class="analysis-value">${distance.toFixed(2)} km</div>
                                        </div>
                                    </div>

                                    <div class="analysis-item">
                                        <span class="analysis-icon">⏱</span>
                                        <div>
                                            <div class="analysis-label">Estimated Travel Time</div>
                                            <div class="analysis-value">${duration.toFixed(0)} mins</div>
                                        </div>
                                    </div>

                                    <div class="analysis-item">
                                        <span class="analysis-icon">🌡</span>
                                        <div>
                                            <div class="analysis-label">Temperature</div>
                                            <div class="analysis-value">${tempMin}°C – ${tempMax}°C</div>
                                        </div>
                                    </div>

                                    <div class="analysis-item">
                                        <span class="analysis-icon">💨</span>
                                        <div>
                                            <div class="analysis-label">Wind Speed</div>
                                            <div class="analysis-value">${windSpeed} km/h</div>
                                        </div>
                                    </div>

                                    <div class="analysis-item">
                                        <span class="analysis-icon">🌧</span>
                                        <div>
                                            <div class="analysis-label">Rain Probability</div>
                                            <div class="analysis-value">${rainProb !== "N/A" ? rainProb + "%" : "N/A"}</div>
                                        </div>
                                    </div>
                                </div>

                                ${warningsHTML}
                            </div>
        `;

        if (selectedCategories.size > 0)
            fetchNearbyPlaces(toLat, toLon);

        button.classList.remove("regen-needed");

    } catch (error) {

        console.error("Unexpected Error:", error);
        alert("Something went wrong. Please try again.");

    } finally {

        button.innerHTML = "Generate Smart Plan";
        button.disabled = false;
    }
}

