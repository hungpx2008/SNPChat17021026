import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from '@teable/icons';
import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@teable/ui-lib';
import { useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
export const NewPopover = (props) => {
    const { className, children, addButton, onSubmit } = props;
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const onAdd = () => {
        if (!addButton.disabled) {
            onSubmit();
            setOpen(false);
        }
    };
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { className: "text-[13px]", size: 'xs', variant: 'outline', children: _jsx(Plus, {}) }) }), _jsxs(PopoverContent, { align: "start", className: cn('min-w-80 overflow-auto', className), children: [_jsx("div", { className: "flex items-center justify-between gap-2", children: children }), _jsx("div", { className: "mt-2 flex justify-end", children: _jsxs(Button, { variant: 'outline', size: 'xs', disabled: addButton.disabled, onClick: onAdd, children: [_jsx(Plus, {}), t('baseQuery.add')] }) })] })] }));
};
