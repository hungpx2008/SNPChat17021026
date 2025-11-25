import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton, cn } from '@teable/ui-lib';
import { isEqual } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { useFields, useIsTouchDevice, useRecord, useViewId, useViews, useTableId, useBaseId, useTablePermission, } from '../../hooks';
import { CommentPanel } from '../comment';
import { ExpandRecordHeader } from './ExpandRecordHeader';
import { ExpandRecordWrap } from './ExpandRecordWrap';
import { RecordEditor } from './RecordEditor';
import { RecordHistory } from './RecordHistory';
import { ExpandRecordModel } from './type';
export const ExpandRecord = (props) => {
    const { model, visible, recordId, commentId, recordIds, serverData, recordHistoryVisible, commentVisible, onPrev, onNext, onClose, onCopyUrl, onRecordHistoryToggle, onCommentToggle, onDelete, onDuplicate, buttonClickStatusHook, } = props;
    const views = useViews();
    const tableId = useTableId();
    const defaultViewId = views?.[0]?.id;
    const viewId = useViewId() ?? defaultViewId;
    const baseId = useBaseId();
    const allFields = useFields({ withHidden: true });
    const showFields = useFields();
    const record = useRecord(recordId, serverData);
    const isTouchDevice = useIsTouchDevice();
    const { t } = useTranslation();
    const tablePermission = useTablePermission();
    const canUpdateRecord = tablePermission['record|update'];
    const fieldCellReadonly = useCallback((field) => {
        if (!canUpdateRecord) {
            return true;
        }
        return Boolean(record?.isLocked(field.id)) || Boolean(field.isComputed);
    }, [record, canUpdateRecord]);
    const showFieldsId = useMemo(() => new Set(showFields.map((field) => field.id)), [showFields]);
    const fields = useMemo(() => (viewId ? allFields.filter((field) => showFieldsId.has(field.id)) : []), [allFields, showFieldsId, viewId]);
    const hiddenFields = useMemo(() => (viewId ? allFields.filter((field) => !showFieldsId.has(field.id)) : []), [allFields, showFieldsId, viewId]);
    const nextRecordIndex = useMemo(() => {
        return recordIds?.length ? recordIds.findIndex((id) => recordId === id) + 1 : -1;
    }, [recordId, recordIds]);
    const prevRecordIndex = useMemo(() => {
        return recordIds?.length ? recordIds.findIndex((id) => recordId === id) - 1 : -1;
    }, [recordId, recordIds]);
    const onChange = useCallback((newValue, fieldId) => {
        if (isEqual(record?.getCellValue(fieldId), newValue)) {
            return;
        }
        if (Array.isArray(newValue) && newValue.length === 0) {
            return record?.updateCell(fieldId, null, { t });
        }
        record?.updateCell(fieldId, newValue, { t });
    }, [record, t]);
    const onPrevInner = () => {
        if (!recordIds?.length || prevRecordIndex === -1) {
            return;
        }
        onPrev?.(recordIds[prevRecordIndex]);
    };
    const onNextInner = () => {
        if (!recordIds?.length || nextRecordIndex === -1) {
            return;
        }
        onNext?.(recordIds[nextRecordIndex]);
    };
    const disabledPrev = prevRecordIndex < 0;
    const disabledNext = !recordIds?.length || nextRecordIndex >= recordIds.length;
    return (_jsx(ExpandRecordWrap, { model: isTouchDevice ? ExpandRecordModel.Drawer : model ?? ExpandRecordModel.Modal, visible: visible, onClose: onClose, className: cn({ 'max-w-5xl': commentVisible }), children: _jsxs("div", { className: "flex h-full flex-col", children: [tableId && recordId && (_jsx(ExpandRecordHeader, { title: record?.title, recordHistoryVisible: recordHistoryVisible, commentVisible: commentVisible, disabledPrev: disabledPrev, disabledNext: disabledNext, onClose: onClose, onPrev: onPrevInner, onNext: onNextInner, onCopyUrl: onCopyUrl, onRecordHistoryToggle: onRecordHistoryToggle, onCommentToggle: onCommentToggle, onDuplicate: onDuplicate, onDelete: onDelete, recordId: recordId, tableId: tableId })), _jsx("div", { className: "relative flex flex-1 overflow-hidden", children: recordHistoryVisible ? (_jsx("div", { className: "flex size-full overflow-hidden rounded-b bg-background", children: _jsx(RecordHistory, { recordId: recordId }) })) : (_jsxs("div", { className: "relative flex w-full flex-1 justify-between overflow-y-auto", children: [fields.length > 0 ? (_jsx("div", { className: "size-full overflow-auto p-9", children: _jsx(RecordEditor, { record: record, fields: fields, hiddenFields: hiddenFields, onChange: onChange, readonly: fieldCellReadonly, buttonClickStatusHook: buttonClickStatusHook }) })) : (_jsx(Skeleton, { className: "h-10 w-full rounded" })), commentVisible && baseId && tableId && recordId && (_jsx("div", { className: "w-[360px] shrink-0", children: _jsx(CommentPanel, { tableId: tableId, recordId: recordId, baseId: baseId, commentId: commentId }) }))] })) })] }) }));
};
