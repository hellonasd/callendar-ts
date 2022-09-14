"use strict";
class HTMLManagerCallendar {
    constructors() { }
    HTMLNavBtn(prevMonth, nextMonth, arrowLeft, arrowRight) {
        const btnPrev = prevMonth || document.createElement("button");
        const btnNext = nextMonth || document.createElement("button");
        const left = arrowLeft || document.createElement("div");
        const right = arrowRight || document.createElement("div");
        left.classList.add("arrowLeft");
        right.classList.add("arrowRight");
        btnPrev.appendChild(left);
        btnNext.appendChild(right);
        btnPrev.classList.add("callendar__prev-month");
        btnNext.classList.add("callendar__next-month");
        return { btnNext, btnPrev };
    }
    HTMLHeader() {
        const header = document.createElement("div");
        header.classList.add("callendar__header");
        return header;
    }
    HTMLnav(d, weeks, monthNames) {
        const nav = document.createElement("nav");
        this.month = document.createElement("button");
        this.year = document.createElement("button");
        const { btnPrev, btnNext } = this.HTMLNavBtn();
        this.month.innerText = monthNames[d.currentDate.getMonth()].monthShortName;
        this.year.innerText = d.currentDate.getFullYear().toString();
        this.month.classList.add("callendar__mont");
        this.year.classList.add("callendar__year");
        nav.classList.add("callendar__nav");
        nav.appendChild(btnPrev);
        nav.appendChild(this.month);
        nav.appendChild(this.year);
        nav.appendChild(btnNext);
        return { nav, year: this.year, month: this.month, btnPrev, btnNext };
    }
    HTMLCreateWrapper() {
        const wrapper = document.createElement("div");
        wrapper.classList.add("callendar__wrapper");
        return wrapper;
    }
    HTMLcreateWeeks(weeks) {
        const ul = document.createElement("ul");
        ul.classList.add("callendar__weeks");
        for (let { weekShort } of weeks) {
            const li = document.createElement("li");
            li.classList.add("callendar__week");
            li.innerText = weekShort;
            ul.appendChild(li);
        }
        return ul;
    }
    HTMLcreateDays(d, monthNames) {
        const ul = document.createElement("ul");
        ul.classList.add("callendar__days");
        if (this.wrapper.querySelector(".callendar__days")) {
            this.wrapper.querySelector(".callendar__days").remove();
        }
        for (let v of d.totalDays) {
            const li = document.createElement("li");
            if (v === d.currentDate.getDate()) {
                li.classList.add("callendar__day-today");
            }
            li.classList.add("callendar__day");
            li.innerText = v.toString();
            ul.append(li);
        }
        if (this.month) {
            this.month.innerHTML = monthNames[d.numberOffMonth - 1].monthShortName;
        }
        if (this.year.innerHTML !== d.currentDate.getFullYear().toString()) {
            this.year.innerHTML = d.currentDate.getFullYear().toString();
        }
        if (this.wrapper.querySelector(".callendar__weeks")) {
            this.wrapper.querySelector(".callendar__weeks").after(ul);
            return ul;
        }
        else {
            this.wrapper.append(ul);
            return ul;
        }
    }
    HTMLCreateBtnTooday() {
        const btn = document.createElement("button");
        btn.classList.add("callendar__today");
        btn.innerText = "Today";
        return btn;
    }
    HTMLInit(main, d, weeks, monthNames) {
        this.wrapper = this.HTMLCreateWrapper();
        this.main = main;
        const header = this.HTMLHeader();
        const { nav, btnPrev, btnNext } = this.HTMLnav(d, weeks, monthNames);
        const weeksWrapp = this.HTMLcreateWeeks(weeks);
        const days = this.HTMLcreateDays(d, monthNames);
        const btnToday = this.HTMLCreateBtnTooday();
        header.appendChild(nav);
        this.wrapper.appendChild(header);
        this.wrapper.appendChild(weeksWrapp);
        this.wrapper.appendChild(days);
        this.wrapper.appendChild(btnToday);
        main.append(this.wrapper);
        return { btnPrev, btnNext, btnToday };
    }
}
class Callendar extends HTMLManagerCallendar {
    constructor(options) {
        super();
        const date = (options === null || options === void 0 ? void 0 : options.date) ? options.date : new Date();
        const locale = (options === null || options === void 0 ? void 0 : options.locale) ? options.locale : "default";
        this.callendar = (options === null || options === void 0 ? void 0 : options.callendar)
            ? options.callendar
            : document.createElement("div");
        this.arrowLeft = (options === null || options === void 0 ? void 0 : options.arrowLeft)
            ? options.arrowLeft
            : document.createElement("div");
        this.arrowRight = (options === null || options === void 0 ? void 0 : options.arrowRight)
            ? options.arrowRight
            : document.createElement("div");
        this.prevMonthBtn = (options === null || options === void 0 ? void 0 : options.prevMonthBtn) ? options.prevMonthBtn : null;
        this.nextMonthBtn = (options === null || options === void 0 ? void 0 : options.nextMonthBtn) ? options.nextMonthBtn : null;
        this.count = 0;
        this.totalDaysInMonth = 42;
        this.d = this.initData(date, locale);
        this.weeks = this.getWeeks(date, locale);
        this.monthNames = this.getMonths(date, locale);
        this.handlerEvents();
    }
    initData(date, locale) {
        locale = locale || "default";
        const d = date ? date : new Date();
        const day = d.getDate();
        const numberOffWeek = d.getDay() - 1 === -1 ? 0 : d.getDay() - 1;
        const nameOffWeekShort = d.toLocaleDateString(locale, { weekday: "short" });
        const nameOffWeekLong = d.toLocaleDateString(locale, { weekday: "long" });
        const numberOffMonth = d.getMonth() + 1;
        const nameOfMonthShort = d
            .toLocaleDateString(locale, { month: "short" })
            .slice(0, 3);
        const nameOfMonthLong = d.toLocaleDateString(locale, { month: "long" });
        const totalDays = this.getDaysInMonth(d, locale);
        return {
            currentDate: d,
            numberOffWeek,
            nameOffWeekShort,
            nameOffWeekLong,
            nameOfMonthShort,
            nameOfMonthLong,
            day,
            numberOffMonth,
            totalDays,
        };
    }
    getWeeks(d, locale) {
        const weeksArray = [];
        const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        for (let i = 0; i < 7; i++) {
            date.setDate(d.getDate() + i);
            const weekName = date.toLocaleDateString(locale, { weekday: "short" });
            const weekNameLong = date.toLocaleDateString(locale, {
                weekday: "long",
            });
            weeksArray[date.getDay() - 1 === -1 ? 6 : date.getDay() - 1] = {
                weekShort: weekName,
                weekLong: weekNameLong,
            };
        }
        return weeksArray;
    }
    getMonths(d, locale) {
        const monthsArray = [];
        const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        for (let i = 0; i < 12; i++) {
            date.setMonth(i);
            const monthShortName = date
                .toLocaleDateString(locale, {
                month: "short",
            })
                .slice(0, 3);
            const monthLongName = date.toLocaleDateString(locale, { month: "long" });
            monthsArray[i] = {
                monthShortName,
                monthLongName,
            };
        }
        return monthsArray;
    }
    getDaysInMonth(d, locale) {
        const firstDayInMonth = new Date(d.getFullYear(), d.getMonth(), 1).getDay() - 1;
        const totalDaysInMounth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        const previosDays = new Date(d.getFullYear(), d.getMonth(), 0).getDate();
        const totalDays = [];
        const afterDays = this.totalDaysInMonth - (firstDayInMonth + totalDaysInMounth);
        totalDays.push(...this.getBeforeDaysInMonth(firstDayInMonth, previosDays));
        totalDays.push(...this.getAfterDaysInMonth(totalDaysInMounth));
        totalDays.push(...this.getAfterDaysInMonth(afterDays - 1));
        return totalDays;
    }
    getBeforeDaysInMonth(weekStart, previosDays) {
        const prevDays = [];
        for (let i = 0; i <= weekStart; i++) {
            prevDays[weekStart - i] = previosDays - i;
        }
        return prevDays;
    }
    getAfterDaysInMonth(days) {
        const daysInMonth = [];
        for (let i = 1; i <= days; i++) {
            daysInMonth.push(i);
        }
        return daysInMonth;
    }
    htmlManager() { }
    nextMonth() { }
    handlerEvents() {
        window.addEventListener("DOMContentLoaded", () => {
            const { btnPrev, btnNext, btnToday } = this.HTMLInit(this.callendar, this.d, this.weeks, this.monthNames);
            btnPrev.addEventListener("click", () => this.setPrevMonth());
            btnNext.addEventListener("click", () => this.setNextMonth());
            btnToday.addEventListener("click", () => this.goBackInToPresentDay());
        });
    }
    setNextMonth() {
        const { currentDate } = this.d;
        currentDate.setMonth(currentDate.getMonth() + 1);
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        let x = this.initData(date, "default");
        this.HTMLcreateDays(x, this.monthNames);
    }
    setPrevMonth() {
        const { currentDate } = this.d;
        currentDate.setMonth(currentDate.getMonth() - 1);
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        let x = this.initData(date, "default");
        this.HTMLcreateDays(x, this.monthNames);
    }
    goBackInToPresentDay() {
        this.d.currentDate = new Date();
        this.HTMLcreateDays(this.d, this.monthNames);
    }
}
const callendar = new Callendar({
    callendar: document.querySelector(".callendar2"),
});
