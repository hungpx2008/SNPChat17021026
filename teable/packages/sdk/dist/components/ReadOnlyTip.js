import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@teable/ui-lib';
import { Trans } from '../context/app/i18n';
import { usePersonalView, useView } from '../hooks';
export const ReadOnlyTip = () => {
    const view = useView();
    const { isPersonalView, openPersonalView } = usePersonalView();
    const readOnly = view?.isLocked && !isPersonalView;
    if (!readOnly) {
        return null;
    }
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("div", { className: 'absolute inset-0 z-50 cursor-not-allowed' }) }), _jsx(TooltipContent, { children: _jsx("span", { className: "text-xs", children: _jsx(Trans, { i18nKey: "common.readOnlyTip", components: {
                                button: (_jsx(Button, { className: "pl-1 text-xs text-secondary underline", size: "xs", onClick: openPersonalView, variant: "link" })),
                            } }) }) })] }) }));
};
