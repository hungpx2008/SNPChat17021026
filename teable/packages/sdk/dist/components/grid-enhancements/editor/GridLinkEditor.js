import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Dialog, DialogContent } from '@teable/ui-lib';
import { useRef, useState } from 'react';
import { useTranslation } from '../../../context/app/i18n';
import { LinkEditorMain } from '../../editor';
import { ExpandRecorder, ExpandRecordModel } from '../../expand-record';
export const GridLinkEditor = (props) => {
    const { record, field, isEditing, setEditing } = props;
    const { id: fieldId, options } = field;
    const cellValue = record.getCellValue(fieldId);
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const linkEditorMainRef = useRef(null);
    const [expandRecordId, setExpandRecordId] = useState();
    const onOpenChange = (open) => {
        if (open)
            return setEditing?.(true);
        return linkEditorMainRef.current?.onReset();
    };
    const onChange = (value) => {
        record.updateCell(fieldId, value, { t });
    };
    const onExpand = (recordId) => {
        setExpandRecordId(recordId);
    };
    const onExpandClose = () => {
        setExpandRecordId(undefined);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: containerRef }), _jsx(Dialog, { open: isEditing, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { container: containerRef.current, className: "flex h-[520px] max-w-4xl flex-col", onMouseDown: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation(), onPointerDownOutside: (e) => e.preventDefault(), onInteractOutside: (e) => e.preventDefault(), children: [_jsx(LinkEditorMain, { ref: linkEditorMainRef, container: containerRef.current || undefined, recordId: record.id, fieldId: fieldId, cellValue: cellValue, options: options, isEditing: isEditing, onChange: onChange, setEditing: setEditing, onExpand: onExpand }), expandRecordId && (_jsx(ExpandRecorder, { tableId: options.foreignTableId, recordId: expandRecordId, model: ExpandRecordModel.Modal, onClose: onExpandClose }))] }) })] }));
};
