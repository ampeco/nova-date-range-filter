## Date Range Filter for Laravel Nova

Nova filter that displays a Date Range Picker instead of a select.

### Install

Run this command in your nova project:
`composer require ampeco/nova-date-range-filter`

### How to use

Just use DateRangeFilter class instead of Filter

```php
use Ampeco\Filters\DateRangeFilter;

class DateRange extends DateRangeFilter
{
    public function apply(Request $request, $query, $value)
    {
        $from = Carbon::parse($value[0])->startOfDay();
        $to = Carbon::parse($value[1])->endOfDay();

        return $query->whereBetween('created_at', [$from, $to]);
    }

    /**
     * Get the filter's available options.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    // public function options(Request $request)
    // {
    //     return [
    //         'firstDayOfWeek' => 0,
    //         'separator' => '-',
    //         'enableTime' => false,
    //         'enableSeconds' => false,
    //         'twelveHourTime' => false
    //     ];
    // }
}
```

### Customization

Use fluent interface to configure your DateRange filter

```php

(new DateRange)->placeholder("Placeholder")->dateFormat("m d Y")

```

In range mode a filter can limit the length of the range. After the first day is clicked, only days within the limit can be
picked; a range that is longer or has one date is not applied, and the matching message is shown under the filter. The filter
can still be cleared.

```php

(new DateRange)->maxRangeDays(60, "The selected period exceeds 60 days.", "Select both a start date and an end date.")

```

A filter that must always be applied, for example one with a default value, can be marked always active. Its clear button is
hidden, an emptied input goes back to the applied value, and "Reset filters" shows the filter's default value again instead of
an empty input.

```php

(new DateRange)->alwaysActive()

```

With time enabled, a range picked in the calendar ends at the time shown in the time input. To end it at 23:59 of its last day
instead, so that a picked range covers whole days:

```php

(new DateRange)->enableTime()->pickedRangeEndsAtEndOfDay()

```
