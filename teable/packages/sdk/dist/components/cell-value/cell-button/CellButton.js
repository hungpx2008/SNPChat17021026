import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { checkButtonClickable, Colors, ColorUtils } from '@teable/core';
import { Button, cn, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@teable/ui-lib';
import { useMemo } from 'react';
import colors from 'tailwindcss/colors';
import { useTranslation } from '../../../context/app/i18n';
export const CellButton = (props) => {
    const { className, style, itemClassName, options: fieldOptions, value, isLookup } = props;
    const { t } = useTranslation();
    const count = value?.count ?? 0;
    const maxCount = fieldOptions.maxCount ?? 0;
    const isClickable = useMemo(() => {
        return !isLookup && checkButtonClickable(fieldOptions, value);
    }, [fieldOptions, value, isLookup]);
    const button = useMemo(() => {
        const rectColor = isClickable ? fieldOptions.color : Colors.Gray;
        const bgColor = ColorUtils.getHexForColor(rectColor);
        const textColor = ColorUtils.shouldUseLightTextOnColor(rectColor) ? colors.white : colors.black;
        return {
            bgColor,
            textColor,
            label: fieldOptions.label,
        };
    }, [fieldOptions, isClickable]);
    return (_jsx("div", { className: cn('flex gap-1 flex-wrap', className), style: style, children: _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", className: cn('flex w-24 h-6 cursor-default', itemClassName), style: {
                                backgroundColor: button.bgColor,
                                borderColor: button.bgColor,
                                color: button.textColor,
                            }, children: _jsx("span", { className: "w-full truncate text-xs", style: { color: button.textColor }, children: button.label }) }) }), _jsx(TooltipContent, { children: _jsx("span", { children: t('common.clickedCount', {
                                label: button.label,
                                text: maxCount > 0 ? `${count}/${maxCount}` : `${count}`,
                            }) }) })] }) }) }));
};
