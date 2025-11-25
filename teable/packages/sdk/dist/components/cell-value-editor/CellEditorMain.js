import { jsx as _jsx } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { temporaryPaste } from '@teable/openapi';
import { useCallback, useEffect, useRef } from 'react';
import { useTableId } from '../../hooks';
import { transformSelectOptions } from '../cell-value';
import { AttachmentEditor, CheckboxEditor, DateEditor, NumberEditor, SelectEditor, TextEditor, RatingEditor, LongTextEditor, LinkEditor, UserEditor, ButtonEditor, } from '../editor';
export const CellEditorMain = (props) => {
    const { field, recordId, cellValue, onChange, readonly, className, context, buttonClickStatusHook, } = props;
    const tableId = useTableId();
    const { id: fieldId, type, options } = field;
    const editorRef = useRef(null);
    useEffect(() => {
        editorRef?.current?.setValue?.(cellValue);
    }, [cellValue]);
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
    switch (type) {
        case FieldType.SingleLineText: {
            return (_jsx(TextEditor, { ref: editorRef, className: className, value: cellValue, options: options, onChange: onChange, readonly: readonly }));
        }
        case FieldType.LongText: {
            return (_jsx(LongTextEditor, { ref: editorRef, className: className, value: cellValue, onChange: onChange, readonly: readonly }));
        }
        case FieldType.Number: {
            return (_jsx(NumberEditor, { ref: editorRef, className: className, value: cellValue, onChange: onChange, readonly: readonly }));
        }
        case FieldType.Rating: {
            return (_jsx(RatingEditor, { className: className, options: options, value: cellValue, onChange: onChange, readonly: readonly }));
        }
        case FieldType.SingleSelect: {
            return (_jsx(SelectEditor, { ref: editorRef, className: className, value: cellValue, preventAutoNewOptions: options.preventAutoNewOptions, options: transformSelectOptions(options.choices), onChange: onChange, readonly: readonly, onOptionAdd: onOptionAdd }));
        }
        case FieldType.MultipleSelect: {
            return (_jsx(SelectEditor, { ref: editorRef, className: className, value: cellValue, options: transformSelectOptions(options.choices), onChange: onChange, isMultiple: true, readonly: readonly, onOptionAdd: onOptionAdd }));
        }
        case FieldType.Checkbox: {
            return (
            // Setting the checkbox size is affected by the font-size causing the height to change.
            _jsx("div", { style: { fontSize: 0 }, children: _jsx(CheckboxEditor, { className: className, value: cellValue, onChange: onChange, readonly: readonly }) }));
        }
        case FieldType.Date: {
            return (_jsx(DateEditor, { ref: editorRef, className: className, options: options, value: cellValue, onChange: (selectedDay) => onChange?.(selectedDay ?? null), readonly: readonly }));
        }
        case FieldType.Attachment: {
            return (_jsx(AttachmentEditor, { className: className, value: cellValue, onChange: onChange, readonly: readonly }));
        }
        case FieldType.Link: {
            return (_jsx(LinkEditor, { className: className, cellValue: cellValue, options: options, onChange: onChange, readonly: readonly, fieldId: field.id, recordId: recordId }));
        }
        case FieldType.User:
        case FieldType.CreatedBy:
        case FieldType.LastModifiedBy: {
            return (_jsx(UserEditor, { className: className, value: cellValue, options: options, onChange: onChange, readonly: readonly, context: context }));
        }
        case FieldType.Button: {
            return (_jsx(ButtonEditor, { field: field, recordId: recordId, className: className, value: cellValue, onChange: onChange, readonly: readonly, statusHook: buttonClickStatusHook }));
        }
        default:
            throw new Error(`The field type (${type}) is not implemented editor`);
    }
};
