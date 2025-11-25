import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from '@teable/icons';
import { Command, CommandInput, CommandItem } from '@teable/ui-lib';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { OptionList } from './components';
const getValue = (value) => {
    if (value == null)
        return [];
    if (Array.isArray(value))
        return value;
    return [value];
};
const SelectEditorMainBase = (props, ref) => {
    const { preventAutoNewOptions, value: originValue, options = [], isMultiple, style, className, onChange, onOptionAdd, initialSearch, } = props;
    const [value, setValue] = useState(getValue(originValue));
    const [searchValue, setSearchValue] = useState(initialSearch ?? '');
    const inputRef = useRef(null);
    const { t } = useTranslation();
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
        setValue: (value) => {
            setValue(getValue(value));
        },
    }));
    const filteredOptions = useMemo(() => {
        if (!searchValue)
            return options;
        return options.filter((v) => v.label.toLowerCase().includes(searchValue.toLowerCase()));
    }, [options, searchValue]);
    const onSelect = (val) => {
        setSearchValue('');
        if (isMultiple) {
            const newValue = value.includes(val) ? value.filter((v) => v !== val) : value.concat(val);
            setValue(newValue);
            return onChange?.(newValue);
        }
        const newValue = val === value[0] ? undefined : val;
        setValue(getValue(newValue));
        onChange?.(newValue);
    };
    const checkIsActive = useCallback((v) => {
        return isMultiple ? value.includes(v) : value[0] === v;
    }, [isMultiple, value]);
    const onOptionAddInner = async () => {
        if (!searchValue || preventAutoNewOptions)
            return;
        setSearchValue('');
        await onOptionAdd?.(searchValue);
        if (isMultiple) {
            const newValue = value.concat(searchValue);
            setValue(newValue);
            return onChange?.(newValue);
        }
        setValue([searchValue]);
        onChange?.(searchValue);
    };
    return (_jsxs(Command, { className: className, style: style, shouldFilter: false, children: [_jsx(CommandInput, { className: "h-8 text-[13px]", ref: inputRef, placeholder: t('common.search.placeholder'), value: searchValue, onValueChange: (value) => setSearchValue(value), onKeyDown: async (e) => {
                    if (e.key === 'Enter' && filteredOptions.length === 0) {
                        e.stopPropagation();
                        await onOptionAddInner();
                    }
                } }), _jsx(OptionList, { options: filteredOptions, onSelect: onSelect, checkIsActive: checkIsActive }), searchValue &&
                !filteredOptions.find((v) => v.label === searchValue) &&
                onOptionAdd &&
                !preventAutoNewOptions && (_jsxs(CommandItem, { className: "items-center justify-center", onSelect: onOptionAddInner, children: [_jsx(Plus, { className: "size-4 shrink-0" }), _jsx("span", { className: "ml-2 truncate text-[13px]", children: t('editor.select.addOption', { option: searchValue }) })] })), preventAutoNewOptions && filteredOptions.length === 0 && (_jsx(CommandItem, { className: "items-center justify-center", children: _jsx("span", { className: "ml-2 truncate text-[13px]", children: t('common.empty') }) }))] }));
};
export const SelectEditorMain = forwardRef(SelectEditorMainBase);
