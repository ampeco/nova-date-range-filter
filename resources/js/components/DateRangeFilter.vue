<template>
    <div class="pt-2 pb-3">
        <h3 class="px-3 text-xs uppercase font-bold tracking-wide">{{ filter.name }}</h3>

        <div class="p-2">
            <input hidden />
            <input
                class="w-full form-control form-input form-input-bordered"
                :disabled="disabled"
                :class="{'!cursor-not-allowed': disabled}"
                :value="value"
                ref="datePicker"
                type="text"
                :placeholder="placeholder"
            />
        </div>
    </div>
</template>
<script>
import flatpickr from 'flatpickr'
import '../../airbnb-modified.css'

export default {
    props: {
        resourceName: {
            type: String,
            required: true,
        },
        filterKey: {
            type: String,
            required: true,
        },

    },

    data: () => ({flatpickr: null}),

    computed: {
        placeholder() {
            return this.filter.placeholder || this.__('Pick a date range')
        },
        startDate() {
            return flatpickr.formatDate(flatpickr.parseDate(this.filter.currentValue[0], this.dateFormat), this.dateFormat)
        },
        endDate() {
            return flatpickr.formatDate(flatpickr.parseDate(this.filter.currentValue[1], this.dateFormat), this.dateFormat)
        },
        value() {
            if (typeof this.filter.currentValue === 'object' && this.filter.currentValue.length >= 2) {
                return `${this.startDate} ${this.separator} ${this.endDate}`
            }
            return this.filter.currentValue || null
        },
        filter() {
            return this.$store.getters[`${this.resourceName}/getFilter`](this.filterKey)
        },
        options() {
            return this.$store.getters[`${this.resourceName}/getOptionsForFilter`](
                this.filterKey
            )
        },
        disabled() {
            return this.filter.disabled
        },
        separator() {
            return this.filter.separator || '-'
        },
        modeType() {
            return (this.filter.mode === 'range') ? 'range' : 'single'
        },
        dateFormat() {
            return this.filter.dateFormat || (this.filter.enableTime ? 'Y-m-d H:i' : 'Y-m-d')
        },
        twelveHourTime() {
            return this.filter.twelveHourTime
        },
        enableTime() {
            return this.filter.enableTime
        },
        enableSeconds() {
            return this.filter.enableSeconds
        },
        firstDayOfWeek() {
            return this.filter.firstDayOfWeek || 0
        },
        defaultHour() {
            return this.filter.mode === 'to' ? 23 : 0
        },
        defaultMinute() {
            return this.filter.mode === 'to' ? 59 : 0
        }
    },

    mounted() {
        const self = this
        this.options.forEach((option) => {
            Object.assign(this.filter, {[option.name]: option.value})
        })
        Nova.$on("clear-filter-values", this.clearValue)
        this.$nextTick(() => {
            this.flatpickr = flatpickr(this.$refs.datePicker, {
                enableTime: this.enableTime,
                enableSeconds: this.enableSeconds,
                onClose: this.handleChange,
                dateFormat: this.dateFormat,
                allowInput: true,
                // static: true,
                mode: this.modeType,
                defaultHour: this.defaultHour,
                defaultMinute: this.defaultMinute,
                time_24hr: !this.twelveHourTime,
                onReady() {
                    self.$refs.datePicker.parentNode.classList.add('date-filter')
                },
                onYearChange: (selectedDates, dateStr, instance) => {
                    // Redraw calendar when year changes via the year input
                    instance.redraw()
                },
                onMonthChange: (selectedDates, dateStr, instance) => {
                    // Redraw calendar when month changes
                    instance.redraw()
                },
                locale: {
                    rangeSeparator: ` ${this.separator} `,
                    firstDayOfWeek: this.firstDayOfWeek
                }
            })
        })
    },

    beforeUnmount() {
        Nova.$off("clear-filter-values", this.clearValue)
        this.flatpickr && this.flatpickr.destroy()
    },

    methods: {
        clearValue() {
            this.flatpickr && this.flatpickr.clear()
        },

        handleChange(value) {
            setTimeout(() => {
                if (this.enableTime && this.modeType === 'range' && value.length === 2) {
                    value[1].setHours(23, 59, 0, 0)
                }

                value = value.map(value => {
                    return flatpickr.formatDate(value, this.dateFormat)
                })

                if (Object.keys(value).length !== 0) {
                    this.$store.commit(`${this.resourceName}/updateFilterState`, {
                        filterClass: this.filterKey,
                        value,
                    });
                    this.$emit('change')
                }
            }, 100)
        },
    }
}
</script>
<style scoped>
.\!cursor-not-allowed {
    cursor: not-allowed !important;
}
</style>
