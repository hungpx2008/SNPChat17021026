import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { FieldType, ColorUtils } from '@teable/core';
import { temporaryPaste } from '@teable/openapi';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import colors from 'tailwindcss/colors';
import { useTranslation } from '../../../context/app/i18n';
import { useTableId } from '../../../hooks';
import { SelectEditorMain } from '../../editor';
import { useGridPopupPosition } from '../hooks';
const GridSelectEditorBase = (props, ref) => {
    const { field, record, rect, style, isEditing, initialSearch, setEditing } = props;
    const { t } = useTranslation();
    const tableId = useTableId();
    const defaultFocusRef = useRef(null);
    const editorRef = useRef(null);
    const { id: fieldId, type: fieldType, options, displayChoiceMap, } = field;
    const isMultiple = fieldType === FieldType.MultipleSelect;
    const cellValue = record.getCellValue(field.id);
    const attachStyle = useGridPopupPosition(rect, 340);
    useEffect(() => {
        if (isMultiple) {
            editorRef.current?.setValue?.(cellValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(cellValue)]);
    useImperativeHandle(ref, () => ({
        focus: () => (editorRef.current || defaultFocusRef.current)?.focus?.(),
        setValue: (value) => {
            editorRef.current?.setValue?.(value);
        },
    }));
    const selectOptions = useMemo(() => {
        const choices = options?.choices || [];
        return choices.map(({ name, color }) => ({
            label: name,
            value: name,
            color: displayChoiceMap[name]?.color ??
                (ColorUtils.shouldUseLightTextOnColor(color) ? colors.white : colors.black),
            backgroundColor: displayChoiceMap[name]?.backgroundColor ?? ColorUtils.getHexForColor(color),
        }));
    }, [options, displayChoiceMap]);
    const onChange = (value) => {
        record.updateCell(fieldId, isMultiple && value?.length === 0 ? null : value, { t });
        if (!isMultiple)
            setTimeout(() => setEditing?.(false));
    };
    const onOptionAdd = useCallback(async (name) => {
        if (!tableId)
            return;
        await temporaryPaste(tableId, {
            content: name,
            projection: [fieldId],
            ranges: [
                [0, 0],
                [0, 0],
            ],
        });
    }, [tableId, fieldId]);
    return (_jsx(_Fragment, { children: isEditing ? (_jsx(SelectEditorMain, { ref: editorRef, style: {
                ...style,
                ...attachStyle,
                height: 'auto',
            }, className: "absolute rounded-sm border p-2 shadow-sm", value: cellValue === null ? undefined : cellValue, isMultiple: isMultiple, preventAutoNewOptions: options?.preventAutoNewOptions, options: selectOptions, initialSearch: initialSearch, onChange: onChange, onOptionAdd: onOptionAdd })) : (_jsx("input", { className: "size-0 opacity-0", ref: defaultFocusRef })) }));
};
export const GridSelectEditor = forwardRef(GridSelectEditorBase);
