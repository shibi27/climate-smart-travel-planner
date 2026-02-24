const calendar = document.getElementById("calendar");
const monthBtn = document.getElementById("monthBtn");
const yearBtn = document.getElementById("yearBtn");
const monthDropdown = document.getElementById("monthDropdown");
const yearDropdown = document.getElementById("yearDropdown");
const calendarContainer = document.getElementById("calendarContainer");
const journeyInput = document.getElementById("journeyDate");
const prevBtn = document.getElementById("prevBtn");

const today = new Date();
const todayDate = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();
let selectedDay = null;
let selectedMonth = null;
let selectedYear = null;
let currentMonth = todayMonth;
let currentYear = todayYear;

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function toggleCalendar() {
    calendarContainer.classList.toggle("hidden");
    renderCalendar();
}

function renderCalendar(direction = "right") {

    calendar.classList.remove(
        "slide-right-start",
        "slide-left-start",
        "slide-active"
    );

    calendar.classList.add("calendar-transition");

    if (direction === "right") {
        calendar.classList.add("slide-right-start");
    } else {
        calendar.classList.add("slide-left-start");
    }

    setTimeout(() => {
        calendar.classList.remove("slide-right-start", "slide-left-start");
        calendar.classList.add("slide-active");
    }, 10);

    calendar.innerHTML = "";

    monthBtn.innerText = monthNames[currentMonth];
    yearBtn.innerText = currentYear;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    if (currentYear === todayYear && currentMonth === todayMonth) {
        prevBtn.classList.add("opacity-30", "cursor-not-allowed");
    } else {
        prevBtn.classList.remove("opacity-30", "cursor-not-allowed");
    }

    for (let i = 0; i < firstDay; i++) {
        calendar.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= lastDate; day++) {

        let isPast =
            currentYear < todayYear ||
            (currentYear === todayYear && currentMonth < todayMonth) ||
            (currentYear === todayYear && currentMonth === todayMonth && day < todayDate);

        if (isPast) {
            calendar.innerHTML += `
                <div class="p-2 text-slate-600 cursor-not-allowed select-none">
                    ${day}
                </div>`;
        } else {

            let isSelected =
                selectedDay === day &&
                selectedMonth === currentMonth &&
                selectedYear === currentYear;

            let isToday =
                day === todayDate &&
                currentMonth === todayMonth &&
                currentYear === todayYear;

            let classes =
                "p-2 rounded-lg cursor-pointer transition-all duration-200 text-white hover:bg-green-500";

            if (isToday) {
                classes += " border border-green-400";
            }

            if (isSelected) {
                classes += " bg-green-500 text-black font-bold scale-110 shadow-lg";
            }

            calendar.innerHTML += `
                <div onclick="selectDate(${day})"
                class="${classes}">
                    ${day}
                </div>`;
        }
    }
}

function prevMonth() {
    if (currentYear === todayYear && currentMonth === todayMonth) return;

    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar("left");
}
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar("right");
}

function selectDate(day) {

    selectedDay = day;
    selectedMonth = currentMonth;
    selectedYear = currentYear;

    let displayFormat =
        String(day).padStart(2, "0") + "-" +
        String(currentMonth + 1).padStart(2, "0") + "-" +
        currentYear;

    journeyInput.value = displayFormat;

    clearResults();
    validateInputs();

    calendarContainer.classList.add("hidden");

    renderCalendar(); 
}
function toggleMonthDropdown() {
    monthDropdown.classList.toggle("hidden");
    yearDropdown.classList.add("hidden");
    monthDropdown.innerHTML = "";

    monthNames.forEach((month, index) => {
        monthDropdown.innerHTML +=
            `<button onclick="event.stopPropagation(); selectMonth(${index})"
                    class="text-white hover:bg-slate-600 p-2 rounded-lg" >
                        ${month}
        </button> `;
    });
}

function toggleYearDropdown() {
    yearDropdown.classList.toggle("hidden");
    monthDropdown.classList.add("hidden");
    yearDropdown.innerHTML = "";

    for (let i = todayYear; i < todayYear + 10; i++) {
        yearDropdown.innerHTML +=
            `<button onclick="event.stopPropagation(); selectYear(${i})"
                    class="text-white hover:bg-slate-600 p-2 rounded-lg" >
                        ${i}
        </button> `;
    }
}

function selectMonth(index) {
    if (currentYear === todayYear && index < todayMonth) return;
    currentMonth = index;
    monthDropdown.classList.add("hidden");
    renderCalendar("right");
}

function selectYear(year) {
    currentYear = year;
    yearDropdown.classList.add("hidden");
    renderCalendar("right");
}

document.addEventListener("click", function (e) {

    if (!calendarContainer.contains(e.target) &&
        !e.target.closest("#journeyDate") &&
        !e.target.closest("span")) {

        calendarContainer.classList.add("hidden");
        monthDropdown.classList.add("hidden");
        yearDropdown.classList.add("hidden");
    }
});
