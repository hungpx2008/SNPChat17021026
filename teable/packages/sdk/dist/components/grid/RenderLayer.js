import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useMemo } from 'react';
import { RegionType } from './interface';
import { drawGrid } from './renderers';
export const RenderLayer = (props) => {
    const { theme, width, height, columns, commentCountMap, isEditing, rowControls, visibleRegion, imageManager, spriteManager, activeCell, activeCellBound, collaborators, searchCursor, searchHitIndex, dragState, scrollState, columnFreezeState, hoverCellPosition, mouseState: originMouseState, selection, isSelecting, isInteracting: _isInteracting, coordInstance, forceRenderFlag, groupCollection, rowIndexVisible, columnStatistics, columnResizeState, columnHeaderHeight, hoveredColumnResizeIndex, isColumnFreezable, isRowAppendEnable, isColumnResizable, isColumnAppendEnable, isMultiSelectionEnable, isColumnHeaderMenuVisible, getCellContent, real2RowIndex, getLinearRow, } = props;
    const { containerWidth } = coordInstance;
    const { x, y, columnIndex, rowIndex, type, isOutOfBounds } = originMouseState;
    const isInteracting = _isInteracting || type === RegionType.ColumnFreezeHandler;
    const mainCanvasRef = useRef(null);
    const lastPropsRef = useRef();
    const cacheCanvas = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.style.opacity = '0';
        canvas.style.position = 'fixed';
        return canvas;
    }, []);
    const mouseState = useMemo(() => {
        return {
            type,
            rowIndex,
            columnIndex,
            isOutOfBounds,
            x: 0,
            y: 0,
        };
    }, [columnIndex, rowIndex, type, isOutOfBounds]);
    const mousePosition = useMemo(() => {
        if (!isInteracting)
            return null;
        return { x, y };
    }, [x, y, isInteracting]);
    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;
        if (mainCanvas == null)
            return;
        const lastProps = lastPropsRef.current;
        const props = {
            theme,
            width,
            height,
            columns,
            commentCountMap,
            isEditing,
            rowControls,
            visibleRegion,
            imageManager,
            spriteManager,
            activeCell,
            activeCellBound,
            collaborators,
            searchCursor,
            searchHitIndex,
            dragState,
            scrollState,
            columnFreezeState,
            hoverCellPosition,
            mouseState: mousePosition ? { ...mouseState, ...mousePosition } : mouseState,
            selection,
            isSelecting,
            isInteracting,
            coordInstance,
            forceRenderFlag,
            groupCollection,
            rowIndexVisible,
            columnStatistics,
            columnResizeState,
            columnHeaderHeight,
            hoveredColumnResizeIndex,
            isColumnFreezable,
            isRowAppendEnable,
            isColumnResizable,
            isColumnAppendEnable,
            isColumnHeaderMenuVisible,
            isMultiSelectionEnable,
            getCellContent,
            real2RowIndex,
            getLinearRow,
        };
        lastPropsRef.current = props;
        drawGrid(mainCanvas, cacheCanvas, props, lastProps);
    }, [
        theme,
        width,
        height,
        columns,
        commentCountMap,
        isEditing,
        rowControls,
        visibleRegion,
        imageManager,
        spriteManager,
        activeCell,
        activeCellBound,
        collaborators,
        searchCursor,
        searchHitIndex,
        dragState,
        mouseState,
        scrollState,
        columnFreezeState,
        mousePosition,
        selection,
        isSelecting,
        isInteracting,
        coordInstance,
        forceRenderFlag,
        groupCollection,
        rowIndexVisible,
        columnStatistics,
        columnResizeState,
        columnHeaderHeight,
        hoverCellPosition,
        hoveredColumnResizeIndex,
        isColumnFreezable,
        isRowAppendEnable,
        isColumnResizable,
        isColumnAppendEnable,
        isColumnHeaderMenuVisible,
        isMultiSelectionEnable,
        cacheCanvas,
        getCellContent,
        real2RowIndex,
        getLinearRow,
    ]);
    return (_jsx("canvas", { ref: mainCanvasRef, className: "pointer-events-none", style: {
            width: containerWidth,
            height,
            backgroundColor: theme.cellBg,
        } }));
};
