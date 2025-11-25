import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { UserEditorMain } from '../../editor/user';
import { useGridPopupPosition } from '../hooks';
const GridUserEditorBase = (props, ref) => {
    const { field, record, rect, style, isEditing, initialSearch, setEditing } = props;
    const { t } = useTranslation();
    const { id: fieldId, options } = field;
    const cellValue = record.getCellValue(field.id);
    const defaultFocusRef = useRef(null);
    const editorRef = useRef(null);
    useImperativeHandle(ref, () => ({
        focus: () => (editorRef.current || defaultFocusRef.current)?.focus?.(),
    }));
    const attachStyle = useGridPopupPosition(rect, 340);
    const onChange = (value) => {
        record.updateCell(fieldId, value, { t });
        if (!options.isMultiple) {
            setTimeout(() => setEditing?.(false));
        }
    };
    return (_jsx(_Fragment, { children: isEditing ? (_jsx(UserEditorMain, { ref: editorRef, style: {
                ...style,
                ...attachStyle,
                height: 'auto',
                minWidth: 280,
            }, className: "absolute rounded-sm border shadow-sm", value: cellValue, isMultiple: options.isMultiple, initialSearch: initialSearch, onChange: onChange })) : (_jsx("input", { className: "size-0 opacity-0", ref: defaultFocusRef })) }));
};
export const GridUserEditor = forwardRef(GridUserEditorBase);
