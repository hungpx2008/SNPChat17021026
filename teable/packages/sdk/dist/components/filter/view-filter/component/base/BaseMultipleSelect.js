import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger, cn, } from '@teable/ui-lib';
import { debounce } from 'lodash';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '../../../../../context/app/i18n';
function BaseMultipleSelect(props) {
    const { t } = useTranslation();
    const { onSelect, value, options, className, popoverClassName, placeholderClassName, disabled = false, optionRender, notFoundText = t('common.noRecords'), displayRender, onSearch, modal, } = props;
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const values = useMemo(() => {
        if (Array.isArray(value) && value.length) {
            return value;
        }
        return [];
    }, [value]);
    const selectHandler = (name) => {
        let newCellValue = null;
        const existIndex = values.findIndex((item) => item === name);
        if (existIndex > -1) {
            newCellValue = values.slice();
            newCellValue.splice(existIndex, 1);
        }
        else {
            newCellValue = [...values, name];
        }
        onSelect?.(newCellValue);
    };
    const selectedValues = useMemo(() => {
        return options.filter((option) => values.includes(option.value));
    }, [values, options]);
    const optionMap = useMemo(() => {
        const map = {};
        options.forEach((option) => {
            const key = option.value;
            const value = option.label;
            map[key] = value;
        });
        return map;
    }, [options]);
    const commandFilter = useCallback((id, searchValue) => {
        const name = optionMap?.[id?.trim()]?.toLowerCase() || '';
        return name.includes(searchValue?.toLowerCase()?.trim()) ? 1 : 0;
    }, [optionMap]);
    const setApplySearchDebounced = useMemo(() => {
        return onSearch ? debounce(onSearch, 200) : undefined;
    }, [onSearch]);
    useEffect(() => {
        if (!isComposing) {
            setApplySearchDebounced?.(searchValue);
        }
    }, [searchValue, isComposing, onSearch, setApplySearchDebounced]);
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, modal: modal, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", role: "combobox", size: "sm", "aria-expanded": open, disabled: disabled, className: cn('justify-between overflow-hidden px-2', className), children: [_jsx("div", { className: "flex shrink gap-1 overflow-auto whitespace-nowrap", children: selectedValues?.length ? (selectedValues?.map((value, index) => displayRender?.(value) || (_jsx("div", { className: cn('px-2 rounded-lg'), children: value.label }, index)))) : (_jsx("span", { className: cn('text-xs font-normal text-muted-foreground', placeholderClassName), children: t('common.selectPlaceHolder') })) }), _jsx(ChevronsUpDown, { className: "ml-2 size-3 shrink-0 opacity-50" })] }) }), _jsx(PopoverContent, { className: cn('p-1', popoverClassName), children: _jsx(Command, { className: "rounded-sm", filter: onSearch ? undefined : commandFilter, shouldFilter: !onSearch, children: _jsxs(CommandList, { className: "mt-1", children: [_jsx(CommandInput, { placeholder: t('common.search.placeholder'), className: "placeholder:text-[13px]", onCompositionStart: () => setIsComposing(true), onCompositionEnd: () => setIsComposing(false), onValueChange: (value) => setSearchValue(value) }), _jsx(CommandEmpty, { children: notFoundText }), _jsx(CommandGroup, { "aria-valuetext": "name", children: options.map((option) => (_jsxs(CommandItem, { value: option.value, onSelect: () => selectHandler(option.value), className: "truncate p-1 text-[13px]", children: [_jsx(Check, { className: cn('mr-2 h-4 w-4 shrink-0', values?.includes(option.value) ? 'opacity-100' : 'opacity-0') }), optionRender?.(option) ?? option.label] }, option.value))) })] }) }) })] }));
}
BaseMultipleSelect.displayName = 'BaseMultipleSelect';
export { BaseMultipleSelect };
