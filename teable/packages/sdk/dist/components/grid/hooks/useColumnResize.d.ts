/// <reference types="react" />
import type { IMouseState, IColumnResizeState, IScrollState } from '../interface';
import type { CoordinateManager } from '../managers';
export declare const useColumnResize: (coordInstance: CoordinateManager, scrollState: IScrollState) => {
    columnResizeState: IColumnResizeState;
    hoveredColumnResizeIndex: number;
    setHoveredColumnResizeIndex: import("react").Dispatch<import("react").SetStateAction<number>>;
    setColumnResizeState: import("react").Dispatch<import("react").SetStateAction<IColumnResizeState>>;
    onColumnResizeStart: (mouseState: IMouseState) => void;
    onColumnResizeChange: (mouseState: IMouseState, onResize?: ((newSize: number, colIndex: number) => void) | undefined) => void;
    onColumnResizeEnd: () => void;
};
