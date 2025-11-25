import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { NumberEditor } from '../../editor';
import { GRID_DEFAULT } from '../../grid/configs';
const { rowHeight: defaultRowHeight } = GRID_DEFAULT;
const GridNumberEditorBase = (props, ref) => {
    const { field, record, rect, style, theme, cell, isEditing } = props;
    const { t } = useTranslation();
    const { cellLineColorActived } = theme;
    const editorRef = useRef(null);
    const { width, height } = rect;
    useImperativeHandle(ref, () => ({
        focus: () => editorRef.current?.focus?.(),
        setValue: (value) => editorRef.current?.setValue?.(value),
        saveValue: () => editorRef.current?.saveValue?.(),
    }));
    const saveValue = (value) => {
        if (value === cell.data || !isEditing)
            return;
        record.updateCell(field.id, value ?? null, { t });
    };
    const attachStyle = useMemo(() => {
        const style = {
            width: width + 4,
            height: height + 4,
            marginLeft: -2,
            marginTop: -2.5,
        };
        if (height > defaultRowHeight) {
            style.paddingBottom = height - defaultRowHeight;
        }
        return style;
    }, [height, width]);
    return (_jsx(NumberEditor, { ref: editorRef, className: "rounded-md border-2 text-right shadow-none focus-visible:ring-transparent", style: { border: `2px solid ${cellLineColorActived}`, ...style, ...attachStyle }, onChange: saveValue, saveOnBlur: false }));
};
export const GridNumberEditor = forwardRef(GridNumberEditorBase);
