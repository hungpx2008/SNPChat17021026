import { useState } from 'react';
import { DEFAULT_COLUMN_RESIZE_STATE, GRID_DEFAULT } from '../configs';
import { RegionType } from '../interface';
import { inRange } from '../utils';
export const useColumnResize = (coordInstance, scrollState) => {
    const [hoveredColumnResizeIndex, setHoveredColumnResizeIndex] = useState(-1);
    const [columnResizeState, setColumnResizeState] = useState(DEFAULT_COLUMN_RESIZE_STATE);
    const onColumnResizeStart = (mouseState) => {
        const { scrollLeft } = scrollState;
        const { type, columnIndex, x } = mouseState;
        if (type === RegionType.ColumnResizeHandler) {
            const { columnResizeHandlerWidth } = GRID_DEFAULT;
            const startOffsetX = coordInstance.getColumnRelativeOffset(columnIndex, scrollLeft);
            const realColumnIndex = inRange(x, startOffsetX, startOffsetX + columnResizeHandlerWidth / 2)
                ? columnIndex - 1
                : columnIndex;
            setColumnResizeState({
                x,
                columnIndex: realColumnIndex,
                width: coordInstance.getColumnWidth(realColumnIndex),
            });
        }
    };
    const onColumnResizeChange = (mouseState, onResize) => {
        const { scrollLeft } = scrollState;
        const { type, x, columnIndex } = mouseState;
        const { columnIndex: resizeColumnIndex, x: resizeX } = columnResizeState;
        if (resizeColumnIndex > -1) {
            const columnWidth = coordInstance.getColumnWidth(resizeColumnIndex);
            const newWidth = Math.max(100, Math.round(columnWidth + x - resizeX));
            setColumnResizeState({
                x,
                columnIndex: resizeColumnIndex,
                width: newWidth,
            });
            return onResize?.(newWidth, resizeColumnIndex);
        }
        if (type === RegionType.ColumnResizeHandler) {
            const { columnResizeHandlerWidth } = GRID_DEFAULT;
            const startOffsetX = coordInstance.getColumnRelativeOffset(columnIndex, scrollLeft);
            const realColumnIndex = inRange(x, startOffsetX, startOffsetX + columnResizeHandlerWidth / 2)
                ? columnIndex - 1
                : columnIndex;
            return setHoveredColumnResizeIndex(realColumnIndex);
        }
        if (hoveredColumnResizeIndex !== -1) {
            setHoveredColumnResizeIndex(-1);
        }
    };
    const onColumnResizeEnd = () => {
        setColumnResizeState(DEFAULT_COLUMN_RESIZE_STATE);
    };
    return {
        columnResizeState,
        hoveredColumnResizeIndex,
        setHoveredColumnResizeIndex,
        setColumnResizeState,
        onColumnResizeStart,
        onColumnResizeChange,
        onColumnResizeEnd,
    };
};
