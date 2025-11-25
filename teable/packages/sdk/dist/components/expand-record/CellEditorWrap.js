import { jsx as _jsx } from "react/jsx-runtime";
import { FieldType } from '@teable/core';
import { cn } from '@teable/ui-lib';
import { CellEditor } from '../cell-value-editor';
import { LinkDisplayType, LinkEditor } from '../editor';
export const CellEditorWrap = (props) => {
    const { field, wrapClassName, className, cellValue, onChange, readonly, recordId } = props;
    if (field.type === FieldType.Link) {
        return (_jsx("div", { className: cn(wrapClassName, 'max-h-96 overflow-auto'), children: _jsx(LinkEditor, { className: className, cellValue: cellValue, options: field.options, onChange: onChange, readonly: readonly, fieldId: field.id, recordId: recordId, displayType: readonly ? LinkDisplayType.List : LinkDisplayType.Grid }) }));
    }
    return _jsx(CellEditor, { ...props });
};
