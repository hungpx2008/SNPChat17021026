import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, cn } from '@teable/ui-lib';
import { useGridTooltipStore } from './grid-tooltip';
export const GridTooltip = (props) => {
    const { id } = props;
    const { tooltipInfo } = useGridTooltipStore();
    const visible = Boolean(tooltipInfo) && tooltipInfo?.id === id;
    const { text, position, triggerClassName, triggerStyle, contentClassName, contentStyle } = tooltipInfo ?? {};
    const style = position
        ? {
            left: position.x,
            top: position.y,
            width: position.width,
            height: position.height,
        }
        : {};
    return (_jsx(_Fragment, { children: visible ? (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { delayDuration: 200, open: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("div", { className: cn('pointer-events-none absolute cursor-pointer', triggerClassName), style: { ...triggerStyle, ...style } }) }), _jsx(TooltipContent, { sideOffset: 8, className: cn('pointer-events-none whitespace-pre-line', contentClassName), style: {
                            ...contentStyle,
                        }, children: text })] }) })) : null }));
};
