import { jsx as _jsx } from "react/jsx-runtime";
import { ColorUtils } from '@teable/core';
import { cn } from '@teable/ui-lib';
import { useMemo } from 'react';
import { BaseMultipleSelect } from './base';
import { DefaultErrorLabel } from './DefaultErrorLabel';
const FilterMultipleSelect = (props) => {
    const { field, value, onSelect, className, popoverClassName, modal } = props;
    const values = useMemo(() => {
        if (Array.isArray(value) && value.length) {
            return value;
        }
        return [];
    }, [value]);
    const options = useMemo(() => {
        return field?.options?.choices.map((choice) => ({
            value: choice.name,
            label: choice.name,
            color: choice.color,
        }));
    }, [field]);
    const displayRender = (value) => {
        return (_jsx("div", { className: cn('px-2 rounded-lg flex-1'), style: {
                backgroundColor: ColorUtils.getHexForColor(value.color),
                color: ColorUtils.shouldUseLightTextOnColor(value.color) ? '#ffffff' : '#000000',
            }, title: value.label, children: value.label }, value?.value));
    };
    const optionRender = (value) => {
        return (_jsx("div", { className: cn('px-2 rounded-lg truncate'), style: {
                backgroundColor: ColorUtils.getHexForColor(value.color),
                color: ColorUtils.shouldUseLightTextOnColor(value.color) ? '#ffffff' : '#000000',
            }, title: value.label, children: value.label }, value?.value));
    };
    return (_jsx(BaseMultipleSelect, { options: options, onSelect: onSelect, value: values, displayRender: displayRender, optionRender: optionRender, className: className, popoverClassName: popoverClassName, defaultLabel: _jsx(DefaultErrorLabel, {}), placeholderClassName: "text-xs", modal: modal }));
};
export { FilterMultipleSelect };
