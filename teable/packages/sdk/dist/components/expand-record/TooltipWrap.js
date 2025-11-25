import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@teable/ui-lib';
export const TooltipWrap = (props) => {
    const { description, disabled, children } = props;
    if (disabled) {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: children }), _jsx(TooltipContent, { children: _jsx("p", { children: description }) })] }) }));
};
