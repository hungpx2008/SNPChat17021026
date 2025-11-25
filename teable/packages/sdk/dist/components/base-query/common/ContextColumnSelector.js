import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from '@teable/icons';
import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@teable/ui-lib';
import { useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { ContextColumnsCommand } from './ContextColumnCommand';
import { useAllColumns } from './useAllColumns';
export const ContextColumnSelector = (props) => {
    const { className, value, isFilter, onChange } = props;
    const [open, setOpen] = useState(false);
    const columns = useAllColumns(isFilter);
    const { t } = useTranslation();
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, modal: true, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", role: "combobox", className: cn('flex h-7 min-w-20 text-[13px] justify-between font-normal', className), size: 'xs', children: [_jsx("span", { children: columns.find((c) => c.column === value)?.name ??
                                value ??
                                t('common.selectPlaceHolder') }), _jsx(ChevronDown, {})] }) }), _jsx(PopoverContent, { align: "start", className: "w-full max-w-[200px] p-0", children: _jsx(ContextColumnsCommand, { isFilter: isFilter, onClick: (col) => {
                        onChange(col.column, col.type);
                        setOpen(false);
                    } }) })] }));
};
