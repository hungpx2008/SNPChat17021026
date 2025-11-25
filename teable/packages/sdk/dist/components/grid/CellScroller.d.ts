import type { MutableRefObject } from 'react';
import type { IActiveCellBound } from './interface';
export interface CellScrollerProps {
    containerRef: MutableRefObject<HTMLDivElement | null>;
    style?: React.CSSProperties;
    scrollEnable?: boolean;
    activeCellBound: IActiveCellBound;
    setCellScrollTop: React.Dispatch<React.SetStateAction<number>>;
}
export interface CellScrollerRef {
    reset: () => void;
}
export declare const CellScroller: import("react").ForwardRefExoticComponent<CellScrollerProps & import("react").RefAttributes<CellScrollerRef>>;
