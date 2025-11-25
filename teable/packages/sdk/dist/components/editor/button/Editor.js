import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { checkButtonClickable, Colors, ColorUtils } from '@teable/core';
import { Button, cn, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@teable/ui-lib';
import { useMemo } from 'react';
import colors from 'tailwindcss/colors';
import { useTranslation } from '../../../context/app/i18n';
export const ButtonEditor = (props) => {
    const { t } = useTranslation();
    const { className, field, recordId, value, statusHook } = props;
    const { options: fieldOptions, isLookup } = field;
    const { tableId, id: fieldId } = field;
    const count = value?.count ?? 0;
    const maxCount = fieldOptions.maxCount ?? 0;
    const isLoading = () => {
        if (!recordId || !statusHook) {
            return false;
        }
        return statusHook.checkLoading(fieldId, recordId);
    };
    const isClickable = useMemo(() => {
        return !isLookup && recordId && checkButtonClickable(fieldOptions, value);
    }, [fieldOptions, value, recordId, isLookup]);
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
    return (_jsx("div", { className: cn('flex items-center h-8'), children: _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", onClick: () => {
                                if (!recordId || !isClickable || !statusHook || isLoading()) {
                                    return;
                                }
                                statusHook.buttonClick({
                                    tableId,
                                    recordId,
                                    fieldId,
                                    name: button.label,
                                });
                            }, className: cn('flex w-24 h-6', className), style: {
                                backgroundColor: button.bgColor,
                                borderColor: button.bgColor,
                                color: button.textColor,
                                opacity: isLoading() ? 0.8 : 1,
                            }, children: _jsx("span", { className: "w-full truncate text-xs", children: button.label }) }) }), _jsx(TooltipContent, { children: _jsx("span", { children: t('common.clickedCount', {
                                label: button.label,
                                text: maxCount > 0 ? `${count}/${maxCount}` : `${count}`,
                            }) }) })] }) }) }));
};
