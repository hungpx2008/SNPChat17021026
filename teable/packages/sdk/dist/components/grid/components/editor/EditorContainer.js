import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { getRandomString } from '@teable/core';
import { clamp } from 'lodash';
import { useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useKeyboardSelection } from '../../hooks';
import { SelectionRegionType, } from '../../interface';
import { CellType } from '../../renderers/cell-renderer/interface';
import { isPrintableKey } from '../../utils';
import { BooleanEditor } from './BooleanEditor';
import { RatingEditor } from './RatingEditor';
import { SelectEditor } from './SelectEditor';
import { TextEditor } from './TextEditor';
const NO_EDITING_CELL_TYPES = new Set([CellType.Boolean, CellType.Rating]);
export const EditorContainerBase = (props, ref) => {
    const { theme, isEditing, coordInstance, scrollState, activeCell, selection, activeCellBound, scrollToItem, onUndo, onRedo, onCopy, onPaste, onChange, onDelete, onRowExpand, setEditing, setActiveCell, setSelection, real2RowIndex, getCellContent, scrollBy, } = props;
    const { scrollLeft, scrollTop } = scrollState;
    const { rowIndex, realRowIndex, columnIndex } = useMemo(() => {
        const [columnIndex, realRowIndex] = activeCell ?? [-1, -1];
        return {
            rowIndex: real2RowIndex(realRowIndex) ?? -1,
            realRowIndex,
            columnIndex,
        };
    }, [activeCell, real2RowIndex]);
    const cellContent = useMemo(() => {
        return getCellContent([columnIndex, realRowIndex]);
    }, [columnIndex, realRowIndex, getCellContent]);
    const { type: cellType, readonly, editorWidth } = cellContent;
    const editingEnable = !readonly && isEditing && activeCell;
    const width = editorWidth ?? coordInstance.getColumnWidth(columnIndex);
    const height = activeCellBound?.height ?? coordInstance.getRowHeight(rowIndex);
    const editorRef = useRef(null);
    const defaultFocusRef = useRef(null);
    const editorId = useMemo(() => `editor-container-${getRandomString(8)}`, []);
    const initialSearchRef = useRef('');
    useImperativeHandle(ref, () => ({
        focus: () => editorRef.current?.focus?.(),
        saveValue: () => editorRef.current?.saveValue?.(),
    }));
    useEffect(() => {
        if (cellContent.type === CellType.Loading)
            return;
        if (!activeCell || isEditing)
            return;
        editorRef.current?.setValue?.(cellContent.data);
    }, [cellContent, activeCell, isEditing]);
    useEffect(() => {
        if (cellType === CellType.Loading)
            return;
        if (!activeCell || selection.type === SelectionRegionType.None)
            return;
        initialSearchRef.current = '';
        requestAnimationFrame(() => (editorRef.current || defaultFocusRef.current)?.focus?.());
    }, [cellType, activeCell, selection, isEditing]);
    useKeyboardSelection({
        editorRef,
        isEditing,
        activeCell,
        selection,
        coordInstance,
        onUndo,
        onRedo,
        onDelete,
        onRowExpand,
        setEditing,
        setActiveCell,
        setSelection,
        scrollToItem,
        scrollBy,
    });
    const editorStyle = useMemo(() => (editingEnable
        ? { pointerEvents: 'auto', minWidth: width, minHeight: height }
        : { pointerEvents: 'none', opacity: 0, width: 0, height: 0 }), [editingEnable, height, width]);
    const rect = useMemo(() => {
        const { rowInitSize, columnInitSize, containerWidth, containerHeight } = coordInstance;
        const x = clamp(coordInstance.getColumnRelativeOffset(columnIndex, scrollLeft), columnInitSize, containerWidth - width);
        const y = clamp(coordInstance.getRowOffset(rowIndex) - scrollTop, rowInitSize, containerHeight - height);
        return {
            x,
            y,
            width,
            height,
            editorId,
        };
    }, [coordInstance, rowIndex, columnIndex, width, height, scrollLeft, scrollTop, editorId]);
    const EditorRenderer = useMemo(() => {
        if (readonly)
            return null;
        const onChangeInner = (value) => {
            onChange?.([columnIndex, realRowIndex], {
                ...cellContent,
                data: value,
            });
        };
        const { customEditor } = cellContent;
        if (customEditor) {
            return customEditor({
                rect,
                theme,
                style: editorStyle,
                cell: cellContent,
                isEditing,
                setEditing,
                onChange: onChangeInner,
                initialSearch: initialSearchRef.current,
            }, editorRef);
        }
        switch (cellType) {
            case CellType.Text:
            case CellType.Link:
            case CellType.Number: {
                return (_jsx(TextEditor, { ref: editorRef, rect: rect, theme: theme, style: editorStyle, cell: cellContent, isEditing: isEditing, onChange: onChangeInner }));
            }
            case CellType.Boolean:
                return (_jsx(BooleanEditor, { ref: editorRef, rect: rect, theme: theme, cell: cellContent, onChange: onChangeInner }));
            case CellType.Rating:
                return (_jsx(RatingEditor, { ref: editorRef, rect: rect, theme: theme, cell: cellContent, onChange: onChangeInner }));
            case CellType.Select:
                return (_jsx(SelectEditor, { ref: editorRef, rect: rect, theme: theme, cell: cellContent, style: editorStyle, isEditing: isEditing, initialSearch: initialSearchRef.current, setEditing: setEditing, onChange: onChangeInner }));
            default:
                return null;
        }
    }, [
        rect,
        theme,
        readonly,
        cellType,
        cellContent,
        columnIndex,
        realRowIndex,
        editorStyle,
        isEditing,
        onChange,
        setEditing,
    ]);
    const onKeyDown = (event) => {
        if (!activeCell || isEditing)
            return;
        if (!isPrintableKey(event.nativeEvent))
            return;
        if (NO_EDITING_CELL_TYPES.has(cellType))
            return;
        const key = event.key;
        if (key && key.length === 1) {
            initialSearchRef.current = key;
        }
        else {
            initialSearchRef.current = '';
        }
        setEditing(true);
        editorRef.current?.setValue?.(null);
    };
    const onPasteInner = (e) => {
        if (!activeCell || isEditing)
            return;
        onPaste?.(selection, e);
    };
    const onCopyInner = (e) => {
        if (isEditing || selection.type === SelectionRegionType.None)
            return;
        onCopy?.(selection, e);
    };
    return (_jsx("div", { id: editorId, className: "click-outside-ignore pointer-events-none absolute left-0 top-0 w-full", children: _jsxs("div", { className: "absolute z-10", style: {
                top: rect.y,
                left: rect.x,
                minWidth: width,
                minHeight: height,
            }, onKeyDown: onKeyDown, onPaste: onPasteInner, onCopy: onCopyInner, children: [EditorRenderer, _jsx("input", { className: "size-0 opacity-0", ref: defaultFocusRef })] }) }));
};
export const EditorContainer = forwardRef(EditorContainerBase);
