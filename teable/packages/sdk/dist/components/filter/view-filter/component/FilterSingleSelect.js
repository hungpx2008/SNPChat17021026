import { jsx as _jsx } from "react/jsx-runtime";
import { ColorUtils } from '@teable/core';
import { cn } from '@teable/ui-lib';
import { useMemo } from 'react';
import { BaseSingleSelect } from './base';
import { DefaultErrorLabel } from './DefaultErrorLabel';
function FilterSingleSelect(props) {
    const { onSelect, field, value, className, popoverClassName, modal } = props;
    const options = useMemo(() => {
        return field?.options?.choices.map((choice) => ({
            value: choice.name,
            label: choice.name,
            color: choice.color,
        }));
    }, [field]);
    const optionRender = (option) => {
        const { color, label, value } = option;
        return (_jsx("div", { className: "truncate rounded-lg px-2", style: {
                backgroundColor: ColorUtils.getHexForColor(color),
                color: ColorUtils.shouldUseLightTextOnColor(color) ? '#ffffff' : '#000000',
            }, children: label }, value));
    };
    return (_jsx(BaseSingleSelect, { options: options, value: value, onSelect: onSelect, className: cn('justify-between', className), popoverClassName: cn(popoverClassName), optionRender: optionRender, displayRender: optionRender, defaultLabel: _jsx(DefaultErrorLabel, {}), placeholderClassName: "text-xs", modal: modal }));
}
export { FilterSingleSelect };
