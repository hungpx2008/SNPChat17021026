import { useCallback, useEffect, useRef } from 'react';
import { SelectionRegionType } from '../../grid/interface';
import { CombinedSelection, emptySelection } from '../../grid/managers';
export const useGridFileEvent = (props) => {
    const { gridRef, onValidation, onCellDrop } = props;
    const stageRef = useRef(null);
    const dropTargetRef = useRef(null);
    useEffect(() => {
        if (gridRef.current) {
            stageRef.current =
                gridRef.current.getContainer()?.querySelector('[data-t-grid-stage]') || null;
        }
    }, [gridRef]);
    const getDropCell = useCallback((event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return gridRef.current?.getCellIndicesAtPosition(x, y) ?? null;
    }, [gridRef]);
    const onDragLeave = useCallback((e) => {
        if (e.target !== stageRef.current)
            return;
        e.preventDefault();
        e.stopPropagation();
        gridRef.current?.setSelection(emptySelection);
    }, [gridRef]);
    const onDragOver = useCallback((e) => {
        if (e.target !== stageRef.current)
            return;
        e.preventDefault();
        e.stopPropagation();
        const cell = getDropCell(e);
        if (!cell || !onValidation(cell))
            return;
        dropTargetRef.current = cell;
        const newSelection = new CombinedSelection(SelectionRegionType.Cells, [cell, cell]);
        gridRef.current?.setSelection(newSelection);
    }, [gridRef, getDropCell, onValidation]);
    const onDrop = useCallback((e) => {
        if (e.target !== stageRef.current)
            return;
        e.preventDefault();
        e.stopPropagation();
        if (!dropTargetRef.current)
            return;
        const files = e.dataTransfer?.files;
        if (!files?.length)
            return;
        onCellDrop(dropTargetRef.current, files);
        dropTargetRef.current = null;
    }, [onCellDrop]);
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage)
            return;
        stage.addEventListener('dragover', onDragOver);
        stage.addEventListener('dragleave', onDragLeave);
        stage.addEventListener('drop', onDrop);
        return () => {
            stage.removeEventListener('dragover', onDragOver);
            stage.removeEventListener('dragleave', onDragLeave);
            stage.removeEventListener('drop', onDrop);
        };
    }, [onDragOver, onDragLeave, onDrop]);
    return { onDragOver, onDragLeave, onDrop };
};
