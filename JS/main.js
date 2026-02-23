document.addEventListener("DOMContentLoaded", () => {

    renderCalendar();
    validateInputs();

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
