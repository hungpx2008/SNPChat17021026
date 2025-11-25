import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { useMemo } from 'react';
import { UserTag } from './UserTag';
export const CellUser = (props) => {
    const { value, className, style, itemClassName, formatImageUrl } = props;
    const innerValue = useMemo(() => {
        if (value == null || Array.isArray(value))
            return value;
        return [value];
    }, [value]);
    return (_jsx("div", { className: cn('flex gap-1 flex-wrap', className), style: style, children: innerValue?.map((itemVal) => {
            const { id, title, avatarUrl } = itemVal;
            return (_jsx(UserTag, { name: title, avatar: avatarUrl, className: itemClassName, formatImageUrl: formatImageUrl }, id));
        }) }));
};
