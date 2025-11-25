import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { MagicAi, Square } from '@teable/icons';
export const LoadingIndicator = (props) => {
    const { cellLoadings, columnLoadings, coordInstance, scrollState } = props;
    if (!cellLoadings.length && !columnLoadings.length)
        return null;
    const { scrollLeft, scrollTop } = scrollState;
    const { rowInitSize, freezeColumnCount, freezeRegionWidth, containerWidth, containerHeight } = coordInstance;
    return (_jsxs("div", { className: "pointer-events-none absolute left-0 top-0 z-10", children: [columnLoadings.map(({ index, progress, onCancel }) => {
                const columnWidth = coordInstance.getColumnWidth(index);
                const columnOffset = coordInstance.getColumnRelativeOffset(index, scrollLeft);
                const isFreeze = index < freezeColumnCount;
                const isColumnVisible = isFreeze ||
                    (columnOffset + columnWidth - 24 >= freezeRegionWidth && columnOffset <= containerWidth);
                if (!isColumnVisible)
                    return null;
                return (_jsx("div", { className: "absolute rounded-sm", style: {
                        left: columnOffset,
                        top: 0,
                        width: columnWidth,
                        height: 24,
                    }, children: _jsx("div", { className: "pointer-events-auto absolute right-1 top-1 cursor-pointer rounded-full bg-background", onClick: onCancel, children: _jsxs("div", { className: "absolute right-0 top-0 flex size-6 items-center justify-center rounded-full", style: {
                                background: `conic-gradient(currentColor ${progress * 360}deg, rgba(0,0,0,0.1) 0deg)`,
                            }, children: [_jsx("div", { className: "absolute inset-1 animate-ping rounded-full bg-foreground/15" }), _jsx("div", { className: "flex size-5 items-center justify-center rounded-full bg-background", children: _jsx(Square, { className: "size-3" }) })] }) }) }, `loading-${index}`));
            }), cellLoadings.map(([columnIndex, rowIndex]) => {
                const rowHeight = coordInstance.getRowHeight(rowIndex);
                const rowOffset = coordInstance.getRowOffset(rowIndex);
                const columnWidth = coordInstance.getColumnWidth(columnIndex);
                const columnOffset = coordInstance.getColumnRelativeOffset(columnIndex, scrollLeft);
                const y = rowOffset - scrollTop;
                const isFreeze = columnIndex < freezeColumnCount;
                const isColumnVisible = isFreeze ||
                    (columnOffset + columnWidth - 24 >= freezeRegionWidth && columnOffset <= containerWidth);
                const isRowVisible = y >= rowInitSize - 4 && y <= containerHeight - rowInitSize + 4;
                if (!isColumnVisible || !isRowVisible)
                    return null;
                return (_jsx("div", { className: "absolute rounded-sm", style: {
                        left: columnOffset,
                        top: rowOffset - scrollTop,
                        width: columnWidth,
                        height: rowHeight,
                    }, children: _jsxs("div", { className: "absolute right-1 top-1 rounded-full bg-background", children: [_jsx("div", { className: "absolute inset-1 animate-ping rounded-full bg-amber-500/30" }), _jsx("div", { className: "absolute inset-0 animate-[spin_1.2s_linear_infinite] rounded-full border-2 border-dotted border-transparent border-t-amber-500" }), _jsx("div", { className: "size-6 p-1", children: _jsx(MagicAi, { className: "size-4 text-amber-500" }) })] }) }, `loading-${columnIndex}-${rowIndex}`));
            })] }));
};
