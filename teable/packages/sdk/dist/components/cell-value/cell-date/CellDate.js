import { jsx as _jsx } from "react/jsx-runtime";
import { DateFormattingPreset, formatDateToString } from '@teable/core';
import { cn } from '@teable/ui-lib';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { OverflowTooltip } from '../components';
export const CellDate = (props) => {
    const { value, formatting, ellipsis, className, style } = props;
    const displayValue = useMemo(() => {
        if (value == null)
            return '';
        if (formatting == null)
            return dayjs(value).format(DateFormattingPreset.ISO);
        return formatDateToString(value, formatting);
    }, [value, formatting]);
    return (_jsx(OverflowTooltip, { text: displayValue, ellipsis: ellipsis, className: cn('w-full text-[13px] leading-5', className), style: style }));
};
