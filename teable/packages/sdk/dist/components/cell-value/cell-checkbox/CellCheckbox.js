import { jsx as _jsx } from "react/jsx-runtime";
import { cn, Checkbox } from '@teable/ui-lib';
import { useMemo } from 'react';
export const CellCheckbox = (props) => {
    const { value, className, style, itemClassName } = props;
    const innerValue = useMemo(() => {
        if (value == null)
            return;
        if (Array.isArray(value))
            return value;
        return [value];
    }, [value]);
    return (_jsx("div", { className: cn('flex gap-1 flex-wrap', className), style: style, children: innerValue?.map((val, index) => {
            return (_jsx(Checkbox, { className: cn('size-5 cursor-default', itemClassName), checked: Boolean(val) }, index));
        }) }));
};
