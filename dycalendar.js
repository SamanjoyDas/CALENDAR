(function (global) {

    "use strict";

    var
        dycalendar = {},

        document = global.document,

        START_YEAR = 1900,

        END_YEAR = 9999,

        monthName = {
            full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            mmm: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        dayName = {
            full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            d: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            dd: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            ddd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        };

    /**
     * @param object data   this contains the calendar data
     * @param object option this is the settings object
     * @return html
     */
    function createMonthTable(data, option) {

        var
            table, tr, td,
            r, c, count;

        table = document.createElement("table");
        tr = document.createElement("tr");

        for (c = 0; c <= 6; c = c + 1) {
            td = document.createElement("td");
            td.innerHTML = "SMTWTFS"[c];
            tr.appendChild(td);
        }
        table.appendChild(tr);

        tr = document.createElement("tr");

        for (c = 0; c <= 6; c = c + 1) {
            if (c === data.firstDayIndex) {
                break;
            }
            td = document.createElement("td");
            tr.appendChild(td);
        }

        count = 1;
        while (c <= 6) {
            td = document.createElement("td");
            td.innerHTML = count;
            if (data.today.date === count && data.today.monthIndex === data.monthIndex && option.highlighttoday === true) {
                td.setAttribute("class", "dycalendar-today-date");
            }
            if (option.date === count && option.month === data.monthIndex && option.highlighttargetdate === true) {
                td.setAttribute("class", "dycalendar-target-date");
            }
            tr.appendChild(td);
            count = count + 1;
            c = c + 1;
        }
        table.appendChild(tr);

        for (r = 3; r <= 7; r = r + 1) {
            tr = document.createElement("tr");
            for (c = 0; c <= 6; c = c + 1) {
                if (count > data.totaldays) {
                    table.appendChild(tr);
                    return table;
                }
                td = document.createElement('td');
                td.innerHTML = count;
                if (data.today.date === count && data.today.monthIndex === data.monthIndex && option.highlighttoday === true) {
                    td.setAttribute("class", "dycalendar-today-date");
                }
                if (option.date === count && option.month === data.monthIndex && option.highlighttargetdate === true) {
                    td.setAttribute("class", "dycalendar-target-date");
                }
                count = count + 1;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        return table;
    }

    /**
     * @param object data   this contains the calendar data
     * @param object option this is the settings object
     * @return html
     */
    function drawCalendarMonthTable(data, option) {

        var
            table,
            div, container, elem;

        table = createMonthTable(data, option);

        container = document.createElement("div");
        container.setAttribute("class", "dycalendar-month-container");

        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-header");
        div.setAttribute("data-option", JSON.stringify(option));

        if (option.prevnextbutton === "show") {
            elem = document.createElement("span");
            elem.setAttribute("class", "dycalendar-prev-next-btn prev-btn");
            elem.setAttribute("data-date", option.date);
            elem.setAttribute("data-month", option.month);
            elem.setAttribute("data-year", option.year);
            elem.setAttribute("data-btn", "prev");
            elem.innerHTML = "&lt;";
            div.appendChild(elem);
        }

        elem = document.createElement("span");
        elem.setAttribute("class", "dycalendar-span-month-year");
        if (option.monthformat === "mmm") {
            elem.innerHTML = data.monthName + " " + data.year;
        } else if (option.monthformat === "full") {
            elem.innerHTML = data.monthNameFull + " " + data.year;
        }

        div.appendChild(elem);

        if (option.prevnextbutton === "show") {
            elem = document.createElement("span");
            elem.setAttribute("class", "dycalendar-prev-next-btn next-btn");
            elem.setAttribute("data-date", option.date);
            elem.setAttribute("data-month", option.month);
            elem.setAttribute("data-year", option.year);
            elem.setAttribute("data-btn", "next");
            elem.innerHTML = "&gt;";
            div.appendChild(elem);
        }

        container.appendChild(div);

        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-body");
        div.appendChild(table);

        container.appendChild(div);

        return container;
    }

    /**
     * @param object data   this contains the calendar data
     * @param object option this is the settings object
     * @return html
     */
    function drawCalendarDay(data, option) {

        var
            div, container, elem;

        container = document.createElement("div");
        container.setAttribute("class", "dycalendar-day-container");

        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-header");

        elem = document.createElement("span");
        elem.setAttribute("class", "dycalendar-span-day");
        if (option.dayformat === "ddd") {
            elem.innerHTML = dayName.ddd[data.targetedDayIndex];
        } else if (option.dayformat === "full") {
            elem.innerHTML = dayName.full[data.targetedDayIndex];
        }

        div.appendChild(elem);

        container.appendChild(div);

        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-body");

        elem = document.createElement("span");
        elem.setAttribute("class", "dycalendar-span-date");
        elem.innerHTML = data.date;

        div.appendChild(elem);

        container.appendChild(div);

        div = document.createElement("div");
        div.setAttribute("class", "dycalendar-footer");

        elem = document.createElement("span");
        elem.setAttribute("class", "dycalendar-span-month-year");
        if (option.monthformat === "mmm") {
            elem.innerHTML = data.monthName + " " + data.year;
        } else if (option.monthformat === "full") {
            elem.innerHTML = data.monthNameFull + " " + data.year;
        }

        div.appendChild(elem);

        container.appendChild(div);

        return container;
    }

    /**
     * @param object source     this is the source object
     * @param object defaults   this is the default object
     * @return object
     */
    function extendSource(source, defaults) {
        var property;
        for (property in defaults) {
            if (source.hasOwnProperty(property) === false) {
                source[property] = defaults[property];
            }
        }
        return source;
    }

    /**
     * @param integer year        1900-9999 (optional) if not set will consider
     *                          the current year.
     * @param integer month        0-11 (optional) 0 = Jan, 1 = Feb, ... 11 = Dec,
     *                          if not set will consider the current month.
     * @param integer date      1-31 (optional)
     * @return boolean|object    if error return false, else calendar detail
     */
    function getCalendar(year, month, date) {

        var
            dateObj = new Date(),
            dateString,
            result = {},
            idx;

        if (year < START_YEAR || year > END_YEAR) {
            global.console.error("Invalid Year");
            return false;
        }
        if (month > 11 || month < 0) {
            global.console.error("Invalid Month");
            return false;
        }
        if (date > 31 || date < 1) {
            global.console.error("Invalid Date");
            return false;
        }

        result.year = year;
        result.month = month;
        result.date = date;

        result.today = {};
        dateString = dateObj.toString().split(" ");

        idx = dayName.ddd.indexOf(dateString[0]);
        result.today.dayIndex = idx;
        result.today.dayName = dateString[0];
        result.today.dayFullName = dayName.full[idx];

        idx = monthName.mmm.indexOf(dateString[1]);
        result.today.monthIndex = idx;
        result.today.monthName = dateString[1];
        result.today.monthNameFull = monthName.full[idx];

        result.today.date = dateObj.getDate();

        result.today.year = dateString[3];

        dateObj.setDate(1);
        dateObj.setMonth(month);
        dateObj.setFullYear(year);
        dateString = dateObj.toString().split(" ");

        idx = dayName.ddd.indexOf(dateString[0]);
        result.firstDayIndex = idx;
        result.firstDayName = dateString[0];
        result.firstDayFullName = dayName.full[idx];

        idx = monthName.mmm.indexOf(dateString[1]);
        result.monthIndex = idx;
        result.monthName = dateString[1];
        result.monthNameFull = monthName.full[idx];

        dateObj.setFullYear(year);
        dateObj.setMonth(month + 1);
        dateObj.setDate(0);
        result.totaldays = dateObj.getDate();

        dateObj.setFullYear(year);
        dateObj.setMonth(month);
        dateObj.setDate(date);
        dateString = dateObj.toString().split(" ");

        idx = dayName.ddd.indexOf(dateString[0]);
        result.targetedDayIndex = idx;
        result.targetedDayName = dateString[0];
        result.targetedDayFullName = dayName.full[idx];

        return result;

    }

    function onClick() {

        document.body.onclick = function (e) {

            e = global.event || e;

            var
                targetDomObject = e.target || e.srcElement,

                date, month, year, btn, option, dateObj;

            if ((targetDomObject) && (targetDomObject.classList) && (targetDomObject.classList.contains("dycalendar-prev-next-btn"))) {
                date = parseInt(targetDomObject.getAttribute("data-date"));
                month = parseInt(targetDomObject.getAttribute("data-month"));
                year = parseInt(targetDomObject.getAttribute("data-year"));
                btn = targetDomObject.getAttribute("data-btn");
                option = JSON.parse(targetDomObject.parentElement.getAttribute("data-option"));

                if (btn === "prev") {
                    month = month - 1;
                    if (month < 0) {
                        year = year - 1;
                        month = 11;
                    }
                }
                else if (btn === "next") {
                    month = month + 1;
                    if (month > 11) {
                        year = year + 1;
                        month = 0;
                    }
                }

                option.date = date;
                option.month = month;
                option.year = year;

                drawCalendar(option);
            }

            if ((targetDomObject) && (targetDomObject.classList) && (targetDomObject.classList.contains("dycalendar-span-month-year"))) {
                option = JSON.parse(targetDomObject.parentElement.getAttribute("data-option"));
                dateObj = new Date();

                option.date = dateObj.getDate();
                option.month = dateObj.getMonth();
                option.year = dateObj.getFullYear();

                drawCalendar(option);
            }
        };
    }

    /**
     * @param object option     user preferences
     * @return boolean          true if success, false otherwise
     */
    dycalendar.draw = function (option) {

        if (typeof option === "undefined") {
            global.console.error("Option missing");
            return false;
        }

        var
            self = this,

            dateObj = new Date(),

            defaults = {
                type: "day",
                month: dateObj.getMonth(),
                year: dateObj.getFullYear(),
                date: dateObj.getDate(),
                monthformat: "full",
                dayformat: "full",
                highlighttoday: false,
                highlighttargetdate: false,
                prevnextbutton: "hide"
            };

        option = extendSource(option, defaults);

        drawCalendar(option);

    };

    function drawCalendar(option) {

        var
            calendar,
            calendarHTML,
            targetedElementBy = "id",
            targetElem,

            i, len, elemArr;

        if (option.target[0] === "#") {
            targetedElementBy = "id";
        } else if (option.target[0] === ".") {
            targetedElementBy = "class";
        }
        targetElem = option.target.substring(1);

        switch (option.type) {
            case "day":
                calendar = getCalendar(option.year, option.month, option.date);
                calendarHTML = drawCalendarDay(calendar, option);
                break;

            case "month":
                calendar = getCalendar(option.year, option.month, option.date);
                calendarHTML = drawCalendarMonthTable(calendar, option);
                break;

            default:
                global.console.error("Invalid type");
                return false;
        }

        if (targetedElementBy === "id") {

            document.getElementById(targetElem).innerHTML = calendarHTML.outerHTML;

        } else if (targetedElementBy === "class") {

            elemArr = document.getElementsByClassName(targetElem);
            for (i = 0, len = elemArr.length; i < len; i = i + 1) {
                elemArr[i].innerHTML = calendarHTML.outerHTML;
            }

        }
    }
    
    onClick();

    global.dycalendar = dycalendar;

}(typeof window !== "undefined" ? window : this));