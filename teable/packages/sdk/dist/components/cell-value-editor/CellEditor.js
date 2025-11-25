import { jsx as _jsx } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { CellValue } from '../cell-value/CellValue';
import { CellEditorMain } from './CellEditorMain';
export const CellEditor = (props) => {
    const { field, cellValue, wrapStyle, wrapClassName } = props;
    const { type, isComputed } = field;
    const isAttachment = type === FieldType.Attachment;
    const isRating = type === FieldType.Rating;
    const isButton = type === FieldType.Button;
    const readonly = isButton ? false : props.readonly;
    return (_jsx("div", { style: wrapStyle, className: wrapClassName, children: (readonly || isComputed) && !isAttachment ? (_jsx(CellValue, { field: field, value: cellValue, className: "text-sm", itemClassName: isRating ? 'size-5' : undefined, readonly: readonly })) : (_jsx(CellEditorMain, { ...props })) }));
};
