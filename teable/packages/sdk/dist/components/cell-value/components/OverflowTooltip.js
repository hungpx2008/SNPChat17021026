import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tooltip, TooltipTrigger, TooltipPortal, TooltipContent, TooltipProvider, cn, } from '@teable/ui-lib';
import { useState, useRef, useEffect, useCallback } from 'react';
export const OverflowTooltip = (props) => {
    const { text = '', ellipsis = false, className, tooltipClassName, onClick } = props;
    const [isOverflow, setOverflow] = useState(false);
    const contentRef = useRef(null);
    const checkOverflow = useCallback(() => {
        if (contentRef.current && ellipsis) {
            const element = contentRef.current;
            const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
            const isOverflow = element.scrollHeight > lineHeight;
            setOverflow(isOverflow);
        }
    }, [ellipsis]);
    useEffect(() => {
        const observer = new ResizeObserver(checkOverflow);
        if (contentRef.current) {
            observer.observe(contentRef.current);
        }
        return () => {
            if (contentRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(contentRef.current);
            }
        };
    }, [checkOverflow]);
    useEffect(() => {
        checkOverflow();
    }, [text, checkOverflow]);
    const Content = (_jsx("div", { ref: contentRef, className: cn('overflow-hidden whitespace-pre-wrap break-all line-clamp-6', className), onClick: (e) => {
            if (onClick) {
                e.stopPropagation();
                onClick();
            }
        }, onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                onClick?.();
            }
        }, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined, title: text, children: text }));
    if (!ellipsis || !isOverflow) {
        return Content;
    }
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { onClick: (e) => {
                        if (onClick) {
                            e.stopPropagation();
                            onClick();
                        }
                    }, className: "w-full text-left", children: _jsx("div", { className: cn(className, 'overflow-hidden'), style: {
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }, children: text }) }), _jsx(TooltipPortal, { children: _jsx(TooltipContent, { className: cn('max-w-60 break-all', tooltipClassName), children: _jsx("p", { children: text }) }) })] }) }));
};
