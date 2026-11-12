const DAY_MS = 24 * 60 * 60 * 1000

function selectedDatesToFilterValue(selectedDates, dateFormat, formatDate) {
    return selectedDates.map(value => formatDate(value, dateFormat))
}

function commitDateRangeFilterValue(store, resourceName, filterKey, value) {
    store.commit(`${resourceName}/updateFilterState`, {
        filterClass: filterKey,
        value,
    })
}

function calendarDaysBetween(from, to) {
    return Math.round(
        (Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
            - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / DAY_MS
    )
}

function rangeLimitViolation(selectedDates, maxRangeDays) {
    if (selectedDates.length === 0) {
        return null
    }

    if (selectedDates.length !== 2) {
        return 'incomplete'
    }

    return calendarDaysBetween(selectedDates[0], selectedDates[1]) > maxRangeDays ? 'exceeded' : null
}

function selectableDatesAround(date, maxRangeDays) {
    return {
        minDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - maxRangeDays, 0, 0, 0),
        maxDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + maxRangeDays, 23, 59, 59),
    }
}

function unrestrictedDates() {
    return {minDate: null, maxDate: null}
}

function pickCompletesRange(selectedDates, pickedDatesCount, typedTextPending) {
    return !typedTextPending && selectedDates.length === 2 && pickedDatesCount === 1
}

function releaseCalendarForTyping(calendar, maxRangeDays) {
    if (!maxRangeDays || (!calendar.config.minDate && !calendar.config.maxDate)) {
        return
    }

    const {value, selectionStart, selectionEnd} = calendar.input
    calendar.set(unrestrictedDates())
    calendar.input.value = value
    calendar.input.setSelectionRange(selectionStart, selectionEnd)
}

function onCalendarDayMouseDown(calendar, handler) {
    if (!calendar.calendarContainer) {
        return
    }

    calendar.calendarContainer.addEventListener('mousedown', (event) => {
        if (event.target.closest('.flatpickr-day')) {
            handler()
        }
    })
}

function moveToEndOfDay(date) {
    date.setHours(23, 59, 0, 0)
}

function restoreCalendarValue(calendar, currentValue, dateFormat) {
    calendar.set(unrestrictedDates())
    calendar.setDate(currentValue, false, dateFormat)
}

module.exports = {
    commitDateRangeFilterValue,
    moveToEndOfDay,
    onCalendarDayMouseDown,
    pickCompletesRange,
    rangeLimitViolation,
    releaseCalendarForTyping,
    restoreCalendarValue,
    selectableDatesAround,
    selectedDatesToFilterValue,
    unrestrictedDates,
}
