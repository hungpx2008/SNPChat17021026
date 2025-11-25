import { jsx as _jsx } from "react/jsx-runtime";
import { ColorUtils } from '@teable/core';
import { cn } from '@teable/ui-lib';
import { keyBy } from 'lodash';
import { useMemo } from 'react';
import colors from 'tailwindcss/colors';
import { SelectTag } from './SelectTag';
export const getColorPairs = (color) => {
    return {
        color: ColorUtils.shouldUseLightTextOnColor(color) ? colors.white : colors.black,
        backgroundColor: ColorUtils.getHexForColor(color),
    };
};
export const transformSelectOptions = (choices) => {
    return choices.map(({ name, color }) => ({
        label: name,
        value: name,
        ...getColorPairs(color),
    }));
};
export const CellSelect = (props) => {
    const { value, options, className, style, ellipsis, itemClassName } = props;
    const innerValue = useMemo(() => {
        if (value == null || Array.isArray(value))
            return value;
        return [value];
    }, [value]);
    const optionMap = useMemo(() => {
        return keyBy(options, 'value');
    }, [options]);
    return (_jsx("div", { className: cn('flex gap-1', ellipsis ? 'flex-nowrap overflow-hidden' : 'flex-wrap', className), style: style, children: innerValue?.map((itemVal) => {
            const option = optionMap[itemVal];
            if (option == null)
                return null;
            const { label, value, color, backgroundColor } = option;
            return (_jsx(SelectTag, { label: label || 'Untitled', color: color, backgroundColor: backgroundColor, className: itemClassName }, value));
        }) }));
};
