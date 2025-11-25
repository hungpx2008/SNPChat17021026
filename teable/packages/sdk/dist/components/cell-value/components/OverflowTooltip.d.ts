import React from 'react';
interface IOverflowTooltipProps {
    text?: string;
    ellipsis?: boolean;
    className?: string;
    tooltipClassName?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}
export declare const OverflowTooltip: (props: IOverflowTooltipProps) => import("react/jsx-runtime").JSX.Element;
export {};
