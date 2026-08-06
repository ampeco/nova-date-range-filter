## Date Range Filter for Laravel Nova

Nova filter that displays a Date Range Picker instead of a select.

### Install

Run this command in your nova project:
`composer require ampeco/nova-date-range-filter`

### How to use

Just use DateRangeFilter class instead of Filter

```php
namespace App\Nova\Filters;

use Ampeco\Filters\DateRangeFilter as BaseDateRangeFilter;
use Illuminate\Http\Request;

class DateRangeFilter extends BaseDateRangeFilter
{
    public function apply(Request $request, $query, $value)
    {
        return $query->whereBetween('created_at', [
            \Carbon\Carbon::parse($value[0])->startOfDay(), // From
            \Carbon\Carbon::parse($value[1])->endOfDay(), // To
        ]);
    }

    /**
     * Get the filter's available options.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function options(Request $request)
    {
        return [
            'mode'           => 'range',       // <- Important!!; And default 'single'
            'dateFormat'     => 'Y-m-d',       // default 'Y-m-d H:i:S'
            'placeholder'    => 'DateRange',   // default __('Pick a date range')
            // -----------------------------------------------------------------------
            // 'separator'      => '/',           // default "-"
            // 'firstDayOfWeek' => 1,             // default 0
            // 'disabled'       => true,          // default false
            // 'twelveHourTime' => true,          // default false
            // 'enableTime'     => true,          // default false
            // 'enableSeconds'  => true,          // default false
        ];
    }
}
```

### Customization

Use fluent interface to configure your DateRange filter

```php
DateRange::make()->enableTime()->placeholder("Placeholder")->dateFormat("Y-m-d"),
// Or simply
new DateRange,
```
