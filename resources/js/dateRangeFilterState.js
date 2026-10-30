function selectedDatesToFilterValue(selectedDates, dateFormat, formatDate) {
    return selectedDates.map(value => formatDate(value, dateFormat))
}

function commitDateRangeFilterValue(store, resourceName, filterKey, value) {
    store.commit(`${resourceName}/updateFilterState`, {
        filterClass: filterKey,
        value,
    })
}

module.exports = {
    commitDateRangeFilterValue,
    selectedDatesToFilterValue,
}
