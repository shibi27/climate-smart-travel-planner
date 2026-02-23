function validateInputs() {

    const fromCity = document.getElementById("yourLocation").value.trim();
    const toCity = document.getElementById("destination").value.trim();
    const dateStr = document.getElementById("journeyDate").value.trim();
    const button = document.getElementById("generateButton");

    let isValidDate = false;

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {

        const parts = dateStr.split("-");
        const selectedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        const todayOnly = new Date(todayYear, todayMonth, todayDate);

        if (selectedDate < todayOnly) {

            let todayFormatted =
                String(todayDate).padStart(2, "0") + "-" +
                String(todayMonth + 1).padStart(2, "0") + "-" +
                todayYear;

            journeyInput.value = todayFormatted;

            selectedDay = todayDate;
            selectedMonth = todayMonth;
            selectedYear = todayYear;

            renderCalendar();

            const msg = document.getElementById("dateCorrectionMessage");

            msg.classList.remove("hidden");
            msg.classList.add("show");

            setTimeout(() => {
                msg.classList.remove("show");
                msg.classList.add("fade-out");

                setTimeout(() => {
                    msg.classList.add("hidden");
                    msg.classList.remove("fade-out");
                }, 400);
            }, 2000);

            isValidDate = true;

        } else {
            isValidDate = true;  
        }
    }

    if (fromCity && toCity && isValidDate) {

        button.classList.remove("disabled");
        button.classList.remove("regen-needed"); 
        button.disabled = false;

    } else {

        button.classList.add("disabled");
        button.disabled = true;
    }
}