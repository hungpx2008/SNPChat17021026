'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { differenceInCalendarDays } from 'date-fns';
import * as React from 'react';
import { DayPicker, labelNext, labelPrevious, useDayPicker, } from 'react-day-picker';
import { cn } from '../utils';
import { Button, buttonVariants } from './button';
export var NavView;
(function (NavView) {
    NavView["Day"] = "day";
    NavView["Year"] = "year";
})(NavView || (NavView = {}));
/**
 * A custom calendar component built on top of react-day-picker.
 * @param props The props for the calendar.
 * @default yearRange 12
 * @returns
 */
function Calendar({ className, showOutsideDays = true, showYearSwitcher = true, yearRange = 12, numberOfMonths, onNavViewChange, ...props }) {
    const [navView, setNavView] = React.useState(NavView.Day);
    const [displayYears, setDisplayYears] = React.useState(React.useMemo(() => {
        const currentYear = new Date().getFullYear();
        return {
            from: currentYear - Math.floor(yearRange / 2 - 1),
            to: currentYear + Math.ceil(yearRange / 2),
        };
    }, [yearRange]));
    React.useEffect(() => {
        onNavViewChange?.(navView);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navView]);
    const { onNextClick, onPrevClick, startMonth, endMonth } = props;
    const columnsDisplayed = navView === NavView.Year ? 1 : numberOfMonths;
    const _monthsClassName = cn('relative flex', props.monthsClassName);
    const _monthCaptionClassName = cn('relative mx-10 flex h-7 items-center justify-center', props.monthCaptionClassName);
    const _weekdaysClassName = cn('flex flex-row', props.weekdaysClassName);
    const _weekdayClassName = cn('w-8 text-sm font-normal text-muted-foreground', props.weekdayClassName);
    const _monthClassName = cn('w-full', props.monthClassName);
    const _captionClassName = cn('relative flex items-center justify-center pt-1', props.captionClassName);
    const _captionLabelClassName = cn('truncate text-sm font-medium', props.captionLabelClassName);
    const buttonNavClassName = buttonVariants({
        variant: 'outline',
        className: 'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
    });
    const _buttonNextClassName = cn(buttonNavClassName, 'right-0', props.buttonNextClassName);
    const _buttonPreviousClassName = cn(buttonNavClassName, 'left-0', props.buttonPreviousClassName);
    const _navClassName = cn('flex items-start', props.navClassName);
    const _monthGridClassName = cn('mx-auto mt-4', props.monthGridClassName);
    const _weekClassName = cn('mt-2 flex w-max items-start', props.weekClassName);
    const _dayClassName = cn('flex size-8 flex-1 items-center justify-center p-0 text-sm', props.dayClassName);
    const _dayButtonClassName = cn(buttonVariants({ variant: 'ghost' }), 'size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100', props.dayButtonClassName);
    const buttonRangeClassName = 'bg-accent [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground';
    const _rangeStartClassName = cn(buttonRangeClassName, 'day-range-start rounded-s-md', props.rangeStartClassName);
    const _rangeEndClassName = cn(buttonRangeClassName, 'day-range-end rounded-e-md', props.rangeEndClassName);
    const _rangeMiddleClassName = cn('bg-accent !text-foreground [&>button]:bg-transparent [&>button]:!text-foreground [&>button]:hover:bg-transparent [&>button]:hover:!text-foreground', props.rangeMiddleClassName);
    const _selectedClassName = cn('[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground', props.selectedClassName);
    const _todayClassName = cn('[&>button]:bg-accent [&>button]:text-accent-foreground', props.todayClassName);
    const _outsideClassName = cn('day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30', props.outsideClassName);
    const _disabledClassName = cn('text-muted-foreground opacity-50', props.disabledClassName);
    const _hiddenClassName = cn('invisible flex-1', props.hiddenClassName);
    return (_jsx(DayPicker, { showOutsideDays: showOutsideDays, className: cn('p-3', className), style: {
            width: 248.8 * (columnsDisplayed ?? 1) + 'px',
        }, classNames: {
            months: _monthsClassName,
            month_caption: _monthCaptionClassName,
            weekdays: _weekdaysClassName,
            weekday: _weekdayClassName,
            month: _monthClassName,
            caption: _captionClassName,
            caption_label: _captionLabelClassName,
            button_next: _buttonNextClassName,
            button_previous: _buttonPreviousClassName,
            nav: _navClassName,
            month_grid: _monthGridClassName,
            week: _weekClassName,
            day: _dayClassName,
            day_button: _dayButtonClassName,
            range_start: _rangeStartClassName,
            range_middle: _rangeMiddleClassName,
            range_end: _rangeEndClassName,
            selected: _selectedClassName,
            today: _todayClassName,
            outside: _outsideClassName,
            disabled: _disabledClassName,
            hidden: _hiddenClassName,
        }, components: {
            Chevron: ({ orientation }) => {
                const Icon = orientation === 'left' ? ChevronLeftIcon : ChevronRightIcon;
                return _jsx(Icon, { className: "h-4 w-4" });
            },
            Nav: ({ className }) => (_jsx(Nav, { className: className, displayYears: displayYears, navView: navView, setDisplayYears: setDisplayYears, startMonth: startMonth, endMonth: endMonth, onPrevClick: onPrevClick, onNextClick: onNextClick })),
            CaptionLabel: (props) => (_jsx(CaptionLabel, { showYearSwitcher: showYearSwitcher, navView: navView, setNavView: setNavView, displayYears: displayYears, ...props })),
            MonthGrid: ({ className, children, ...props }) => (_jsx(MonthGrid, { className: className, displayYears: displayYears, startMonth: startMonth, endMonth: endMonth, navView: navView, setNavView: setNavView, ...props, children: children })),
        }, numberOfMonths: columnsDisplayed, ...props }));
}
Calendar.displayName = 'Calendar';
function Nav({ className, navView, startMonth, endMonth, displayYears, setDisplayYears, onPrevClick, onNextClick, }) {
    const { nextMonth, previousMonth, goToMonth } = useDayPicker();
    const isPreviousDisabled = (() => {
        if (navView === NavView.Year) {
            return ((startMonth &&
                differenceInCalendarDays(new Date(displayYears.from - 1, 0, 1), startMonth) < 0) ||
                (endMonth && differenceInCalendarDays(new Date(displayYears.from - 1, 0, 1), endMonth) > 0));
        }
        return !previousMonth;
    })();
    const isNextDisabled = (() => {
        if (navView === NavView.Year) {
            return ((startMonth &&
                differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), startMonth) < 0) ||
                (endMonth && differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), endMonth) > 0));
        }
        return !nextMonth;
    })();
    const handlePreviousClick = React.useCallback(() => {
        if (!previousMonth)
            return;
        if (navView === NavView.Year) {
            setDisplayYears((prev) => ({
                from: prev.from - (prev.to - prev.from + 1),
                to: prev.to - (prev.to - prev.from + 1),
            }));
            onPrevClick?.(new Date(displayYears.from - (displayYears.to - displayYears.from), 0, 1));
            return;
        }
        goToMonth(previousMonth);
        onPrevClick?.(previousMonth);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previousMonth, goToMonth]);
    const handleNextClick = React.useCallback(() => {
        if (!nextMonth)
            return;
        if (navView === NavView.Year) {
            setDisplayYears((prev) => ({
                from: prev.from + (prev.to - prev.from + 1),
                to: prev.to + (prev.to - prev.from + 1),
            }));
            onNextClick?.(new Date(displayYears.from + (displayYears.to - displayYears.from), 0, 1));
            return;
        }
        goToMonth(nextMonth);
        onNextClick?.(nextMonth);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [goToMonth, nextMonth]);
    return (_jsxs("nav", { className: cn('flex items-center', className), children: [_jsx(Button, { variant: "outline", className: "absolute left-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100", type: "button", tabIndex: isPreviousDisabled ? undefined : -1, disabled: isPreviousDisabled, "aria-label": navView === NavView.Year
                    ? `Go to the previous ${displayYears.to - displayYears.from + 1} years`
                    : labelPrevious(previousMonth), onClick: handlePreviousClick, children: _jsx(ChevronLeftIcon, { className: "size-4" }) }), _jsx(Button, { variant: "outline", className: "absolute right-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100", type: "button", tabIndex: isNextDisabled ? undefined : -1, disabled: isNextDisabled, "aria-label": navView === NavView.Year
                    ? `Go to the next ${displayYears.to - displayYears.from + 1} years`
                    : labelNext(nextMonth), onClick: handleNextClick, children: _jsx(ChevronRightIcon, { className: "size-4" }) })] }));
}
function CaptionLabel({ children, showYearSwitcher, navView, setNavView, displayYears, ...props }) {
    if (!showYearSwitcher)
        return _jsx("span", { ...props, children: children });
    return (_jsx(Button, { className: "h-7 w-full truncate text-sm font-medium", variant: "ghost", size: "sm", onClick: () => setNavView((prev) => (prev === NavView.Day ? NavView.Year : NavView.Day)), children: navView === NavView.Day ? children : displayYears.from + ' - ' + displayYears.to }));
}
function MonthGrid({ className, children, displayYears, startMonth, endMonth, navView, setNavView, ...props }) {
    if (navView === NavView.Year) {
        return (_jsx(YearGrid, { displayYears: displayYears, startMonth: startMonth, endMonth: endMonth, setNavView: setNavView, navView: navView, className: className, ...props }));
    }
    return (_jsx("table", { className: className, ...props, children: children }));
}
function YearGrid({ className, displayYears, startMonth, endMonth, setNavView, navView, ...props }) {
    const { goToMonth, selected } = useDayPicker();
    return (_jsx("div", { className: cn('grid grid-cols-4 gap-y-2', className), ...props, children: Array.from({ length: displayYears.to - displayYears.from + 1 }, (_, i) => {
            const isBefore = differenceInCalendarDays(new Date(displayYears.from + i, 11, 31), startMonth) < 0;
            const isAfter = differenceInCalendarDays(new Date(displayYears.from + i, 0, 0), endMonth) > 0;
            const isDisabled = isBefore || isAfter;
            return (_jsx(Button, { className: cn('h-7 w-full text-sm font-normal text-foreground', displayYears.from + i === new Date().getFullYear() &&
                    'bg-accent font-medium text-accent-foreground'), variant: "ghost", onClick: () => {
                    setNavView(NavView.Day);
                    goToMonth(new Date(displayYears.from + i, selected?.getMonth() ?? 0));
                }, disabled: navView === NavView.Year ? isDisabled : undefined, children: displayYears.from + i }, i));
        }) }));
}
export { Calendar };
