<?php

namespace Ampeco\Filters;

use Laravel\Nova\Filters\Filter;

abstract class DateRangeFilter extends Filter
{
    public $component = 'date-range-filter';


    public function enableTime()
    {
        $this->withMeta(['enableTime' => true]);
        return $this;
    }

    public function dateFormat($format)
    {
        $this->withMeta(['dateFormat' => $format]);
        return $this;
    }

    public function placeholder($placeholder)
    {
        $this->withMeta(['placeholder' => $placeholder]);
        return $this;
    }

    public function maxRangeDays($days, $exceededMessage, $incompleteMessage)
    {
        $this->withMeta([
            'maxRangeDays' => (int) $days,
            'rangeMessages' => [
                'exceeded' => $exceededMessage,
                'incomplete' => $incompleteMessage,
            ],
        ]);
        return $this;
    }

    public function alwaysActive()
    {
        $this->withMeta(['alwaysActive' => true]);
        return $this;
    }

    public function pickedRangeEndsAtEndOfDay()
    {
        $this->withMeta(['pickedRangeEndsAtEndOfDay' => true]);
        return $this;
    }
}
