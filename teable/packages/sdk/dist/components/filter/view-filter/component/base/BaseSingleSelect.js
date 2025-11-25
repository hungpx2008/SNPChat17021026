import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Command, CommandEmpty, CommandInput, CommandItem, CommandGroup, Popover, PopoverContent, PopoverTrigger, CommandList, cn, } from '@teable/ui-lib';
import { debounce } from 'lodash';
import { Check, ChevronDown } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from '../../../../../context/app/i18n';
function BaseSingleSelect(props) {
    const [searchValue, setSearchValue] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const { t } = useTranslation();
    const { onSelect, value, options, className, popoverClassName, placeholderClassName, disabled = false, optionRender, notFoundText = t('common.noRecords'), displayRender, search = true, onSearch, placeholder = t('common.search.placeholder'), cancelable = false, defaultLabel = t('common.untitled'), modal, groupHeading, } = props;
    const [open, setOpen] = useState(false);
    const label = useMemo(() => {
        return options.find((option) => option.value === value)?.label || defaultLabel;
    }, [defaultLabel, options, value]);
    const selectedValue = useMemo(() => {
        return options.find((option) => option.value === value);
    }, [options, value]);
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
    const renderOptions = () => options?.map((option) => (_jsxs(CommandItem, { value: option.value, onSelect: () => {
            // support re-select to reset selection when cancelable is enabled
            if (cancelable && value === option.value) {
                onSelect(null);
                setOpen(false);
                return;
            }
            onSelect(option.value);
            setOpen(false);
        }, className: "truncate text-sm", children: [_jsx(Check, { className: cn('mr-2 h-4 w-4 shrink-0', value === option.value ? 'opacity-100' : 'opacity-0') }), optionRender?.(option) ?? option.label ?? defaultLabel] }, option.value)));
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, modal: modal, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", role: "combobox", "aria-expanded": open, disabled: disabled, className: cn('justify-between truncate overflow-hidden px-3 font-normal', className), children: [value ? ((selectedValue && displayRender?.(selectedValue)) ?? (_jsx("span", { className: "truncate", children: label }))) : (_jsx("span", { className: cn('text-sm font-normal text-muted-foreground', placeholderClassName), children: t('common.selectPlaceHolder') })), _jsx(ChevronDown, { className: "ml-2 size-4 shrink-0 text-muted-foreground" })] }) }), _jsx(PopoverContent, { className: cn('p-1', popoverClassName), children: _jsxs(Command, { filter: onSearch ? undefined : commandFilter, shouldFilter: !onSearch, children: [search ? (_jsx(CommandInput, { placeholder: placeholder, className: "placeholder:text-sm", onCompositionStart: () => setIsComposing(true), onCompositionEnd: () => setIsComposing(false), onValueChange: (value) => setSearchValue(value) })) : null, _jsx(CommandEmpty, { children: notFoundText }), _jsx(CommandList, { className: "mt-1", children: groupHeading ? (_jsx(CommandGroup, { heading: groupHeading, children: renderOptions() })) : (renderOptions()) })] }) })] }));
}
BaseSingleSelect.displayName = 'BaseSingleSelect';
export { BaseSingleSelect };
