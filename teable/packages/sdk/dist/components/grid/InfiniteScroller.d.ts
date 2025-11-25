import type { MutableRefObject } from 'react';
import type { IGridProps } from './Grid';
import type { ILinearRow, IScrollState } from './interface';
import type { CoordinateManager } from './managers';
export interface ScrollerProps extends Pick<IGridProps, 'smoothScrollX' | 'smoothScrollY' | 'scrollBarVisible' | 'onScrollChanged' | 'onVisibleRegionChanged'> {
    coordInstance: CoordinateManager;
    containerWidth: number;
    containerHeight: number;
    scrollWidth: number;
    scrollHeight: number;
    containerRef: MutableRefObject<HTMLDivElement | null>;
    left?: number;
    top?: number;
    scrollEnable?: boolean;
    scrollState: IScrollState;
    getLinearRow: (index: number) => ILinearRow;
    setScrollState: React.Dispatch<React.SetStateAction<IScrollState>>;
}
export interface ScrollerRef {
    scrollTo: (sl?: number, st?: number) => void;
    scrollBy: (deltaX: number, deltaY: number) => void;
}
export declare const InfiniteScroller: import("react").ForwardRefExoticComponent<ScrollerProps & import("react").RefAttributes<ScrollerRef>>;
