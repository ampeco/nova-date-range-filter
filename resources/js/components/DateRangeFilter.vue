<template>
  <div>
    <h3 class="text-sm uppercase tracking-wide text-80 bg-30 p-3">{{ filter.name }}</h3>

    <div class="p-2">
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

  data: () => ({ flatpickr: null }),

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
      if (typeof this.filter.currentValue === 'object' && this.filter.currentValue.length >= 2){
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
    }
  },

  mounted() {
    const self = this
    this.options.forEach((option) => {
      Object.assign(this.filter, {[option.name]: option.value})
    })
    this.$nextTick(() => {
      this.flatpickr = flatpickr(this.$refs.datePicker, {
        enableTime: this.enableTime,
        enableSeconds: this.enableSeconds,
        onClose: this.handleChange,
        dateFormat: this.dateFormat,
        allowInput: true,
        // static: true,
        mode: this.modeType,
        time_24hr: !this.twelveHourTime,
        onReady() {
          self.$refs.datePicker.parentNode.classList.add('date-filter')
        },
        locale: {
          rangeSeparator: ` ${this.separator} `,
          firstDayOfWeek: this.firstDayOfWeek
        }
      })
    })
  },

  methods: {
    handleChange(value) {
      if (!value.length ) {
        setTimeout(() => {
            this.$store.commit(`${this.resourceName}/updateFilterState`, {
                filterClass: this.filterKey,
                value : "",
            });
            this.$emit('change');
        }, 100)
      } else {
        setTimeout(() => {
            value = value.map(value => {
                return flatpickr.formatDate(value, this.dateFormat)
            })
            this.$store.commit(`${this.resourceName}/updateFilterState`, {
                filterClass: this.filterKey,
                value,
            });
            this.$emit('change');
        }, 100)
      }
    },
  }
}
</script>
<style scoped>
.\!cursor-not-allowed {
  cursor: not-allowed !important;
}
</style>
