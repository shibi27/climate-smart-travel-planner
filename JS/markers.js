const orangeIcon = createIcon("orange");
const violetIcon = createIcon("violet");
const brownIcon = createIcon("grey"); 

const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [40, 60],       
    iconAnchor: [20, 60],
    popupAnchor: [1, -50],
    shadowSize: [60, 60]
});

const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [40, 60],       
    iconAnchor: [20, 60],
    popupAnchor: [1, -50],
    shadowSize: [60, 60]
});

function createIcon(color) {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [30, 46],
        iconAnchor: [15, 46],
        popupAnchor: [1, -40],
        shadowSize: [46, 46]
    });
}