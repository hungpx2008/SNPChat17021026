import { useRef, useState } from 'react';
import { useUnmount, useUpdateEffect } from 'react-use';
import { RegionType, SelectionRegionType, SelectableType } from '../interface';
import { CombinedSelection } from '../managers';
export const useSelection = (props) => {
    const { coordInstance, selectable, isMultiSelectionEnable, getLinearRow, setActiveCell, onSelectionChanged, } = props;
    const onSelectionChangedRef = useRef();
    const prevSelectedRowIndex = useRef(null);
    const [isSelecting, setSelecting] = useState(false);
    const [selection, setSelection] = useState(() => new CombinedSelection());
    const { pureRowCount } = coordInstance;
    onSelectionChangedRef.current = onSelectionChanged;
    const onSelectionStart = (event, mouseState) => {
        if (selectable !== SelectableType.All && selectable !== SelectableType.Cell)
            return;
        const { type, rowIndex, columnIndex } = mouseState;
        const { isRowSelection: isPrevRowSelection, ranges: prevRanges } = selection;
        const isShiftKey = event.shiftKey && !event.metaKey;
        switch (type) {
            case RegionType.Cell:
            case RegionType.ActiveCell: {
                const { realIndex } = getLinearRow(rowIndex);
                const range = [columnIndex, realIndex];
                const isExpandSelection = isShiftKey && !isPrevRowSelection && prevRanges[0] != null;
                const ranges = [isExpandSelection ? prevRanges[0] : range, range];
                if (!isExpandSelection) {
                    setActiveCell(range);
                }
                isMultiSelectionEnable && setSelecting(true);
                return setSelection(selection.set(SelectionRegionType.Cells, ranges));
            }
            case RegionType.RowHeaderDragHandler:
            case RegionType.RowHeaderCheckbox:
            case RegionType.ColumnHeader:
            case RegionType.AllCheckbox:
            case RegionType.RowHeader:
            case RegionType.AppendRow:
                return;
            default:
                setActiveCell(null);
                return setSelection(selection.reset());
        }
    };
    const onSelectionChange = (mouseState) => {
        const { isCellSelection, ranges } = selection;
        const { rowIndex, columnIndex } = mouseState;
        if (!isSelecting)
            return;
        const { realIndex } = getLinearRow(rowIndex);
        const newRange = [columnIndex, realIndex];
        if (isCellSelection && !selection.equals([ranges[0], newRange])) {
            setSelection(selection.merge(newRange));
        }
    };
    const onSelectionEnd = () => {
        setSelecting(false);
    };
    const onSelectionClick = (event, mouseState
    // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
        const { shiftKey, metaKey } = event;
        const isShiftKey = shiftKey && !metaKey;
        const isMetaKey = metaKey && !shiftKey;
        const { type, rowIndex: hoverRowIndex, columnIndex } = mouseState;
        const { ranges: prevSelectionRanges, isColumnSelection: isPrevColumnSelection, isRowSelection: isPrevRowSelection, } = selection;
        const pureSelectColumnOrRow = (colOrRowIndex, type) => {
            const range = [colOrRowIndex, colOrRowIndex];
            let newSelection;
            if (isPrevRowSelection &&
                (isMultiSelectionEnable ||
                    (!isMultiSelectionEnable && prevSelectionRanges[0][0] === colOrRowIndex))) {
                newSelection = selection.merge(range);
            }
            else {
                newSelection = selection.set(type, [range]);
            }
            if (newSelection.includes(range)) {
                prevSelectedRowIndex.current = colOrRowIndex;
            }
            setActiveCell(null);
            setSelection(newSelection);
        };
        switch (type) {
            case RegionType.ColumnHeader: {
                if (selectable !== SelectableType.All && selectable !== SelectableType.Column)
                    return;
                const thresholdColIndex = isMultiSelectionEnable && isShiftKey && isPrevColumnSelection
                    ? prevSelectionRanges[0][0]
                    : columnIndex;
                const ranges = [
                    [Math.min(thresholdColIndex, columnIndex), Math.max(thresholdColIndex, columnIndex)],
                ];
                let newSelection = selection.set(SelectionRegionType.Columns, ranges);
                if (isMultiSelectionEnable && isMetaKey && isPrevColumnSelection) {
                    newSelection = selection.merge([columnIndex, columnIndex]);
                }
                if (!isShiftKey || !isPrevColumnSelection) {
                    const { isNoneSelection, ranges } = newSelection;
                    isNoneSelection ? setActiveCell(null) : setActiveCell([ranges[0][0], 0]);
                }
                return setSelection(newSelection);
            }
            case RegionType.RowHeaderCheckbox: {
                const { realIndex: rowIndex } = getLinearRow(hoverRowIndex);
                if (selectable !== SelectableType.All && selectable !== SelectableType.Row)
                    return;
                const range = [rowIndex, rowIndex];
                if (isMultiSelectionEnable &&
                    isShiftKey &&
                    isPrevRowSelection &&
                    prevSelectedRowIndex.current != null) {
                    if (selection.includes(range))
                        return;
                    const prevIndex = prevSelectedRowIndex.current;
                    const newRange = [Math.min(rowIndex, prevIndex), Math.max(rowIndex, prevIndex)];
                    const newSelection = selection.expand(newRange);
                    prevSelectedRowIndex.current = rowIndex;
                    setActiveCell(null);
                    return setSelection(newSelection);
                }
                return pureSelectColumnOrRow(rowIndex, SelectionRegionType.Rows);
            }
            case RegionType.Cell: {
                const { realIndex: rowIndex } = getLinearRow(hoverRowIndex);
                if (selectable === SelectableType.Row) {
                    return pureSelectColumnOrRow(rowIndex, SelectionRegionType.Rows);
                }
                if (selectable === SelectableType.Column) {
                    return pureSelectColumnOrRow(columnIndex, SelectionRegionType.Columns);
                }
                return;
            }
            case RegionType.AllCheckbox: {
                if (selectable !== SelectableType.All && selectable !== SelectableType.Row)
                    return;
                const allRanges = [[0, pureRowCount - 1]];
                const isPrevAll = isPrevRowSelection && selection.equals(allRanges);
                const newSelection = isPrevAll
                    ? selection.reset()
                    : selection.set(SelectionRegionType.Rows, allRanges);
                return setSelection(newSelection);
            }
        }
    };
    const onSelectionContextMenu = (mouseState, callback
    // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
        const { x, y, columnIndex, rowIndex: hoverRowIndex, type } = mouseState;
        if ([RegionType.Blank, RegionType.ColumnStatistic, RegionType.GroupStatistic].includes(type))
            return;
        const { isCellSelection: isPrevCellSelection, isRowSelection: isPrevRowSelection, isColumnSelection: isPrevColumnSelection, } = selection;
        const isCellHovered = columnIndex >= -1 && hoverRowIndex > -1;
        const isColumnHovered = columnIndex > -1 && hoverRowIndex === -1;
        if (isCellHovered) {
            const { realIndex: rowIndex } = getLinearRow(hoverRowIndex);
            const checkedRange = (isPrevCellSelection
                ? [columnIndex, rowIndex]
                : isPrevRowSelection
                    ? [rowIndex, rowIndex]
                    : isPrevColumnSelection
                        ? [columnIndex, columnIndex]
                        : undefined);
            const inPrevRanges = selection.includes(checkedRange);
            if (inPrevRanges) {
                return callback(selection, { x, y });
            }
            if (columnIndex > -1) {
                const range = [columnIndex, rowIndex];
                const newSelection = selection.set(SelectionRegionType.Cells, [range, range]);
                setActiveCell(range);
                setSelection(newSelection);
                return callback(newSelection, { x, y });
            }
        }
        if (isColumnHovered) {
            const inPrevColumnRanges = isPrevColumnSelection && selection.includes([columnIndex, columnIndex]);
            if (inPrevColumnRanges) {
                return callback(selection, { x, y });
            }
            const newSelection = selection.set(SelectionRegionType.Columns, [[columnIndex, columnIndex]]);
            setActiveCell([columnIndex, 0]);
            setSelection(newSelection);
            callback(newSelection, { x, y });
        }
    };
    useUpdateEffect(() => {
        onSelectionChangedRef.current?.(selection);
    }, [selection]);
    useUnmount(() => {
        onSelectionChangedRef.current = undefined;
    });
    return {
        selection,
        isSelecting,
        setActiveCell,
        setSelection,
        onSelectionStart,
        onSelectionChange,
        onSelectionEnd,
        onSelectionClick,
        onSelectionContextMenu,
    };
};
