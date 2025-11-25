import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CalendarIcon } from '@radix-ui/react-icons';
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger, cn } from '@teable/ui-lib';
import * as React from 'react';
import { useTranslation } from '../../../../../context/app/i18n';
function DatePicker(props) {
    const { value, onSelect, field } = props;
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const date = React.useMemo(() => {
        if (value) {
            return new Date(value);
        }
    }, [value]);
    const selectHandler = (date) => {
        onSelect?.(date.toISOString());
        setOpen(false);
    };
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", variant: 'outline', className: cn('w-max justify-start text-left font-normal m-1', !date && 'text-muted-foreground'), children: [_jsx(CalendarIcon, { className: "mr-2 size-4" }), date ? field?.cellValue2String(date) : _jsx("span", { children: t('editor.date.placeholder') })] }) }), _jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: _jsx(Calendar, { mode: "single", selected: date, defaultMonth: date, onSelect: selectHandler, initialFocus: true }) })] }));
}
export { DatePicker };
