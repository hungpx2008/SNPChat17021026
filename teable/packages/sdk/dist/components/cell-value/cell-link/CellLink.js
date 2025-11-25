import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useMemo } from 'react';
export const CellLink = (props) => {
    const { value, className, style, itemClassName } = props;
    const innerValue = useMemo(() => {
        if (value == null || Array.isArray(value))
            return value;
        return [value];
    }, [value]);
    return (_jsx("div", { className: cn('flex gap-1 flex-wrap', className), style: style, children: innerValue?.map((itemVal) => {
            const { id, title = 'Unnamed record' } = itemVal;
            return (_jsx("span", { title: title, className: cn('text-[13px] rounded-md bg-secondary px-2 h-6 leading-6 truncate', itemClassName), children: title }, id));
        }) }));
};
