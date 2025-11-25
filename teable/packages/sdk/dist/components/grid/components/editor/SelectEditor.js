import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from '@teable/icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from '@teable/ui-lib';
import { noop } from 'lodash';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
const SelectEditorBase = (props, ref) => {
    const { cell, isEditing, style, onChange, setEditing, theme } = props;
    const { data, isMultiple, choiceSorted = [], choiceMap = {} } = cell;
    const [values, setValues] = useState(data);
    const inputRef = useRef(null);
    const { cellOptionBg, cellOptionTextColor } = theme;
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        setValue: (data) => setValues(data),
        saveValue: noop,
    }));
    const onSelect = (v, id) => {
        const existIndex = values.findIndex((item) => {
            if (typeof item === 'string')
                return item === v;
            return item.title === v;
        });
        const newCellValue = existIndex > -1
            ? values.filter((_, index) => index !== existIndex)
            : [...values, id ? { id, title: v } : v];
        if (!isMultiple) {
            const value = newCellValue.length ? newCellValue[newCellValue.length - 1] : null;
            setTimeout(() => setEditing?.(false));
            setValues(value ? [value] : []);
            return onChange?.(value);
        }
        const value = newCellValue.length ? newCellValue : null;
        setValues(value || []);
        return onChange?.(value);
    };
    return (_jsxs(Command, { className: "rounded-sm border p-2 shadow-sm", style: style, children: [_jsx(CommandInput, { ref: inputRef, placeholder: "Search" }), _jsxs(CommandList, { children: [_jsx(CommandEmpty, { children: "No found." }), _jsx(CommandGroup, { "aria-valuetext": "name", children: isEditing &&
                            choiceSorted.map(({ name, id }) => (_jsxs(CommandItem, { className: "justify-between", value: name, onSelect: () => onSelect(name, id), children: [_jsx("div", { className: "text-ellipsis whitespace-nowrap rounded-[6px] px-2 text-[12px]", style: {
                                            backgroundColor: (choiceMap?.[id] ?? choiceMap?.[name])?.backgroundColor ?? cellOptionBg,
                                            color: (choiceMap?.[id] ?? choiceMap?.[name])?.color ?? cellOptionTextColor,
                                        }, children: name }), values?.includes(name) && _jsx(Check, { className: 'ml-2 size-4' })] }, name))) })] })] }));
};
export const SelectEditor = forwardRef(SelectEditorBase);
