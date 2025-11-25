import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@teable/ui-lib';
import { useState } from 'react';
import { SINGLE_SELECT_OPERATORS } from './constant';
import { DefaultList } from './DefaultList';
import { DefaultTrigger } from './DefaultTrigger';
export const FilterLinkSelect = (props) => {
    const { value, operator, onSelect, components, className, modal } = props;
    const { Trigger, List } = components || {};
    const [open, setOpen] = useState(false);
    const InnerTrigger = Trigger ?? DefaultTrigger;
    const InnerSelector = List ?? DefaultList;
    const onListClick = (recordId) => {
        const values = typeof value === 'string' ? [value] : value || [];
        if (!SINGLE_SELECT_OPERATORS.includes(operator)) {
            values.includes(recordId)
                ? onSelect(values.filter((id) => id !== recordId))
                : onSelect([...values, recordId]);
        }
        else {
            setOpen(false);
            onSelect(value?.[0] === recordId ? null : recordId);
        }
    };
    return (_jsx("div", { className: "space-y-3", children: _jsxs(Popover, { open: open, onOpenChange: setOpen, modal: modal, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: 'sm', className: cn('w-40 justify-start overflow-auto px-2', className), children: _jsx(InnerTrigger, { ...props }) }) }), _jsx(PopoverContent, { className: "h-[350px] w-screen md:w-[480px]", children: _jsx(InnerSelector, { ...props, onClick: onListClick }) })] }) }));
};
