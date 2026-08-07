document.addEventListener("DOMContentLoaded", () => {

    renderCalendar();
    validateInputs();

    if (window.innerWidth <= 768) {
        document.querySelector(".bottom-nav")?.classList.remove("hidden");
    }

});

document.getElementById("yourLocation").addEventListener("input", () => {
    clearResults();
    validateInputs();
});
document.getElementById("destination").addEventListener("input", () => {
    clearResults();
    validateInputs();
});
document.getElementById("journeyDate").addEventListener("input", () => {
    clearResults();
    validateInputs();
});
document.getElementById("priority").addEventListener("change", () => {
    clearResults();
    validateInputs();
});

const toggleBtn = document.getElementById("toggleMapBtn");
const mapEl = document.getElementById("map");

toggleBtn?.addEventListener("click", () => {

    mapEl.classList.toggle("collapsed");

    if (mapEl.classList.contains("collapsed")) {
        toggleBtn.innerText = "Show Map";
    } else {
        toggleBtn.innerText = "Hide Map";
    }

});

if (window.innerWidth <= 768) {
    toggleBtn.classList.remove("hidden");
}

function scrollToMap() {

    const mapEl = document.getElementById("map");
    const toggleBtn = document.getElementById("toggleMapBtn");

    if (mapEl.classList.contains("collapsed")) {
        mapEl.classList.remove("collapsed");

        if (toggleBtn) {
            toggleBtn.innerText = "🗺 Hide Map";
        }
    }

    mapEl.scrollIntoView({ behavior: "smooth" });

}
function scrollToForm() {
    document.querySelector(".card").scrollIntoView({ behavior: "smooth" });
}
function scrollToResults() {
    document.getElementById("output").scrollIntoView({ behavior: "smooth" });
}

if (window.innerWidth <= 768) {
    document.querySelector(".bottom-nav").classList.remove("hidden");
}

let startY = 0;
const card = document.querySelector(".card");

card.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
});

card.addEventListener("touchmove", (e) => {
    let currentY = e.touches[0].clientY;
    if (currentY - startY > 120) {
        card.style.transform = "translateY(100%)";
    }
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();
    deferredPrompt = e;

    installBtn.classList.remove("hidden");

});

installBtn.addEventListener("click", async () => {

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
        console.log("User installed the app");
    }

    deferredPrompt = null;
    installBtn.classList.add("hidden");

});
