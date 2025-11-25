import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@teable/ui-lib';
import { useTranslation } from '../../../../context/app/i18n';
export const DefaultErrorLabel = () => {
    const { t } = useTranslation();
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("span", { className: "truncate text-red-500", children: t('filter.invalidateSelected') }) }), _jsx(TooltipContent, { children: _jsx("p", { children: t('filter.invalidateSelectedTips') }) })] }) }));
};
