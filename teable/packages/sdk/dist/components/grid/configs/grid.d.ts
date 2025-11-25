import { DragRegionType, RegionType } from '../interface';
export declare const GRID_CONTAINER_ATTR = "data-t-grid-container";
export declare const GRID_DEFAULT: {
    rowHeight: number;
    rowHeadWidth: number;
    rowHeadIconPaddingTop: number;
    appendRowHeight: number;
    groupHeaderHeight: number;
    maxRowCount: number;
    columnWidth: number;
    columnHeadHeight: number;
    columnHeadMenuSize: number;
    columnHeadMenuClickableSize: number;
    columnHeadPadding: number;
    columnAppendBtnWidth: number;
    columnResizeHandlerWidth: number;
    columnResizeHandlerPaddingTop: number;
    columnFreezeHandlerWidth: number;
    columnFreezeHandlerHeight: number;
    cellHorizontalPadding: number;
    cellVerticalPaddingXS: number;
    cellVerticalPaddingSM: number;
    cellVerticalPaddingMD: number;
    cellVerticalPaddingLG: number;
    cellTextLineHeight: number;
    fillHandlerSize: number;
    columnStatisticHeight: number;
    minColumnStatisticWidth: number;
    scrollBuffer: number;
    cellScrollBuffer: number;
    cellScrollBarWidth: number;
    cellScrollBarMinHeight: number;
    cellScrollBarPaddingX: number;
    cellScrollBarPaddingY: number;
    cellEditorEdgePadding: number;
};
export declare const DEFAULT_MOUSE_STATE: {
    x: number;
    y: number;
    rowIndex: number;
    columnIndex: number;
    type: RegionType;
    isOutOfBounds: boolean;
};
export declare const DEFAULT_SCROLL_STATE: {
    scrollTop: number;
    scrollLeft: number;
    isScrolling: boolean;
};
export declare const DEFAULT_COLUMN_RESIZE_STATE: {
    columnIndex: number;
    width: number;
    x: number;
};
export declare const DEFAULT_DRAG_STATE: {
    type: DragRegionType;
    ranges: never[];
    delta: number;
    isDragging: boolean;
};
export declare const DEFAULT_FREEZE_COLUMN_STATE: {
    sourceIndex: number;
    targetIndex: number;
    isFreezing: boolean;
};
export declare const ROW_RELATED_REGIONS: Set<RegionType>;
