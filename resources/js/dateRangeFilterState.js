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

function resetCalendar(calendar, alwaysActive, currentValue, dateFormat) {
    if (alwaysActive) {
        calendar.set({minDate: null, maxDate: null})
        calendar.setDate(currentValue, false, dateFormat)
        return
    }

    calendar.clear()
}

module.exports = {
    commitDateRangeFilterValue,
    rangeLimitViolation,
    resetCalendar,
    selectableDatesAround,
    selectedDatesToFilterValue,
}
