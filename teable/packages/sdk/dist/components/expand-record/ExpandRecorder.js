import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { deleteRecord } from '@teable/openapi';
import { sonner } from '@teable/ui-lib';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { LocalStorageKeys } from '../../config/local-storage-keys';
import { StandaloneViewProvider, ViewProvider } from '../../context';
import { useTranslation } from '../../context/app/i18n';
import { useBaseId, useRecordOperations, useTableId, useTablePermission } from '../../hooks';
import { syncCopy } from '../../utils';
import { ExpandRecord } from './ExpandRecord';
const { toast } = sonner;
const Wrap = (props) => {
    const { tableId, children } = props;
    const currentTableId = useTableId();
    const baseId = useBaseId();
    if (tableId !== currentTableId) {
        return (_jsx(StandaloneViewProvider, { baseId: baseId, tableId: tableId, children: _jsx(ViewProvider, { children: children }) }));
    }
    return _jsx(_Fragment, { children: children });
};
export const ExpandRecorder = (props) => {
    const { model, tableId, recordId, recordIds, serverData, onClose, onUpdateRecordIdCallback, commentId, viewId, buttonClickStatusHook, } = props;
    const { t } = useTranslation();
    const permission = useTablePermission();
    const { duplicateRecord } = useRecordOperations();
    const editable = Boolean(permission['record|update']);
    const canRead = Boolean(permission['record|read']);
    const canDelete = Boolean(permission['record|delete']);
    const [recordHistoryVisible, setRecordHistoryVisible] = useLocalStorage(LocalStorageKeys.RecordHistoryVisible, false);
    const [commentVisible, setCommentVisible] = useLocalStorage(LocalStorageKeys.CommentVisible, !!commentId || false);
    useEffect(() => {
        commentId && setCommentVisible(true);
    }, [commentId, setCommentVisible]);
    if (!recordId) {
        return _jsx(_Fragment, {});
    }
    const onDuplicate = async () => {
        await duplicateRecord({
            tableId,
            recordId,
            order: {
                viewId: viewId || '',
                anchorId: recordId,
                position: 'after',
            },
        });
        toast.success(t('expandRecord.duplicateRecord'));
    };
    const updateCurrentRecordId = (recordId) => {
        onUpdateRecordIdCallback?.(recordId);
    };
    const onCopyUrl = () => {
        const url = window.location.href;
        syncCopy(url);
        toast.success(t('expandRecord.copy'));
    };
    const onRecordHistoryToggle = () => {
        setCommentVisible(false);
        setRecordHistoryVisible(!recordHistoryVisible);
    };
    const onCommentToggle = () => {
        setRecordHistoryVisible(false);
        setCommentVisible(!commentVisible);
    };
    return (_jsx("div", { id: `${tableId}-${recordId}`, children: _jsx(Wrap, { tableId: tableId, children: _jsx(ExpandRecord, { visible: true, model: model, recordId: recordId, recordIds: recordIds, commentId: commentId, serverData: serverData?.id === recordId ? serverData : undefined, recordHistoryVisible: editable && recordHistoryVisible, commentVisible: canRead && commentVisible, onClose: onClose, onPrev: updateCurrentRecordId, onNext: updateCurrentRecordId, onCopyUrl: onCopyUrl, onDuplicate: viewId ? onDuplicate : undefined, onRecordHistoryToggle: onRecordHistoryToggle, onCommentToggle: onCommentToggle, onDelete: async () => {
                    if (canDelete)
                        await deleteRecord(tableId, recordId);
                }, buttonClickStatusHook: buttonClickStatusHook }) }) }));
};
