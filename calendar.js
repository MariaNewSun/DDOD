const today = new Date();
let monthDisplayed = today.getMonth();
let yearDisplayed = today.getFullYear();

const numMonthsToDisplay = 3;
const validMonths = getValidMonths(today.getMonth(), numMonthsToDisplay);

const prevMonthArrow = document.querySelector("#calendar-left-arrow");
const nextMonthArrow = document.querySelector("#calendar-right-arrow");

populateCalendar(yearDisplayed, monthDisplayed);

prevMonthArrow.addEventListener("click", () => {
    if (validMonths.includes(getPrevMonth(monthDisplayed))) {
        monthDisplayed = getPrevMonth(monthDisplayed);
        if (monthDisplayed === 11) { yearDisplayed--; }
        populateCalendar(yearDisplayed, monthDisplayed);
    }
});

nextMonthArrow.addEventListener("click", () => {
    if (validMonths.includes(getNextMonth(monthDisplayed))) {
        monthDisplayed = getNextMonth(monthDisplayed);
        if (monthDisplayed === 0) { yearDisplayed++; }
        populateCalendar(yearDisplayed, monthDisplayed);
    }
});

function populateCalendar(year, month) {
    const monthObject = document.querySelector("#calendar-month");
    monthObject.innerText = `${monthNumToStr(month)}  ${year}`;
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";
    const firstRow = document.createElement("tr");
    tableBody.append(firstRow);

    // Populate first row with previous month's dates if necessary
    let date = new Date(year, month);
    const numEmptySpots = getDayOfWeek(date);
    date.setDate(date.getDate() - numEmptySpots);
    for (let i = 0; i < numEmptySpots; i++) {
        firstRow.append(getDateContainer(date.getFullYear(), date.getMonth(), date.getDate()));
        date.setDate(date.getDate() + 1);
    }

    // Finish populating the first row with days from this month
    date = new Date(year, month);
    for (let i = getDayOfWeek(date); i < 7; i++) {
        firstRow.append(getDateContainer(date.getFullYear(), date.getMonth(), date.getDate()));
        date.setDate(date.getDate() + 1);
    }

    // Fill in the rest of the month
    while (date.getMonth() == month) {
        const newRow = document.createElement("tr");
        tableBody.append(newRow);
        for (let i = 0; i < 7; i++) {
            newRow.append(getDateContainer(date.getFullYear(), date.getMonth(), date.getDate()));
            date.setDate(date.getDate() + 1);
        }
    }

    fillInEvents();
    updateArrowColors();
}

function getDateContainer(year, month, dayOfTheMonth) {
    const todaysDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dateToCreate = new Date(year, month, dayOfTheMonth);

    const td = document.createElement("td");
    const dateContainer = document.createElement("div");
    const dateHeading = document.createElement("div");
    const dateContent = document.createElement("div");

    td.append(dateContainer);
    dateContainer.append(dateHeading, dateContent);

    dateContainer.classList.add("date-container");
    dateHeading.classList.add("date-heading");
    dateContent.classList.add("date-content");

    dateContainer.id = dateToCreate.toDateString().split(' ').join('-');
    dateHeading.innerText = dayOfTheMonth;

    if (todaysDate.getTime() > dateToCreate.getTime()) {
        td.classList.add("past-date");
    } else if (todaysDate.getTime() === dateToCreate.getTime()) {
        td.classList.add("todays-date");
    }
    return td;
}

function fillInEvents() {
    for (let event of calendarEvents) {
        const eventId = event.date.toDateString().split(' ').join('-');
        const dateContainer = document.querySelector(`#${eventId}`);
        if (dateContainer) {
            const dateContent = dateContainer.children[1];

            const eventContainer = document.createElement("div");
            eventContainer.classList.add("event-container");

            const eventTimeShort = document.createElement("span");
            eventTimeShort.classList.add("event-time-short");

            const eventTimeFull = document.createElement("span");
            eventTimeFull.classList.add("event-time-full");

            const eventName = document.createElement("a");
            eventName.classList.add("event-name");

            const eventNameFlyOut = document.createElement("a");
            eventNameFlyOut.classList.add("event-name-fly-out");

            const eventFlyOut = document.createElement("div");
            eventFlyOut.classList.add("event-fly-out");

            const eventImg = document.createElement("img");
            eventImg.classList.add("event-img");

            const eventTimeAndLink = document.createElement("div");
            eventTimeAndLink.classList.add("event-time-and-link");

            const eventRegLink = document.createElement("a");
            eventRegLink.classList.add("event-reg-link");

            const externalTabIcon = document.createElement("i");
            externalTabIcon.classList.add("fa-solid", "fa-arrow-up-right-from-square");

            const eventDesc = document.createElement("p");
            eventDesc.classList.add("event-desc");

            dateContent.append(eventContainer);
            eventContainer.append(eventTimeShort, eventName, eventFlyOut);
            eventTimeAndLink.append(eventTimeFull, eventRegLink);
            eventRegLink.append("Sign Up", externalTabIcon);
            eventFlyOut.append(eventImg, eventNameFlyOut, eventTimeAndLink, eventDesc);

            eventTimeShort.append(event.timeShort);
            eventTimeFull.append(event.timeFull);
            eventName.append(event.name);
            eventNameFlyOut.append(event.name);
            eventDesc.append(event.desc);
            eventImg.src = event.imageSource;
            eventRegLink.href = event.regLink;
            eventRegLink.target = "_blank";
            eventRegLink.rel = "noopener noreferrer";

        }
    }
}

function updateArrowColors() {
    if (validMonths.includes(getPrevMonth(monthDisplayed))) {
        prevMonthArrow.classList.remove("calendar-arrow-invalid");
        prevMonthArrow.classList.add("calendar-arrow-valid");
    } else {
        prevMonthArrow.classList.remove("calendar-arrow-valid");
        prevMonthArrow.classList.add("calendar-arrow-invalid");
    }

    if (validMonths.includes(getNextMonth(monthDisplayed))) {
        nextMonthArrow.classList.remove("calendar-arrow-invalid");
        nextMonthArrow.classList.add("calendar-arrow-valid");
    } else {
        nextMonthArrow.classList.remove("calendar-arrow-valid");
        nextMonthArrow.classList.add("calendar-arrow-invalid");
    }
}

function getValidMonths(startMonth, numMonthsToDisplay) {
    const validMonths = [];
    let monthToAppend = startMonth;
    for (let i = 0; i < numMonthsToDisplay; i++) {
        validMonths.push(monthToAppend);
        monthToAppend = getNextMonth(monthToAppend);
    }
    return validMonths;
}

function getDayOfWeek(date) {
    return (date.getDay() === 0 ? 6 : date.getDay() - 1);
}

function getPrevMonth(monthNum) {
    return (monthNum === 0 ? 11 : monthNum - 1);
}

function getNextMonth(monthNum) {
    return (monthNum === 11 ? 0 : monthNum + 1);
}

function monthNumToStr(monthNum) {
    switch (monthNum) {
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
    }
}