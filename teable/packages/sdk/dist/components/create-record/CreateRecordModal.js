import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from '@tanstack/react-query';
import { FieldKeyType } from '@teable/core';
import { createRecords } from '@teable/openapi';
import { Dialog, DialogTrigger, DialogContent, Spin, Button } from '@teable/ui-lib';
import { isEqual, keyBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCounter } from 'react-use';
import { useTranslation } from '../../context/app/i18n';
import { useBaseId, useFields, useSession, useTableId, useView, useViewId } from '../../hooks';
import { createRecordInstance, recordInstanceFieldMap } from '../../model';
import { extractDefaultFieldsFromFilters } from '../../utils/filterWithDefaultValue';
import { RecordEditor } from '../expand-record/RecordEditor';
export const CreateRecordModal = (props) => {
    const { children, callback } = props;
    const tableId = useTableId();
    const baseId = useBaseId();
    const viewId = useViewId();
    const view = useView();
    const showFields = useFields();
    const [open, setOpen] = useState(false);
    const [version, updateVersion] = useCounter(0);
    const { t } = useTranslation();
    const allFields = useFields({ withHidden: true });
    const { user } = useSession();
    const [record, setRecord] = useState(undefined);
    const filter = view?.filter;
    const userId = user.id;
    const { mutate: createRecord, isLoading } = useMutation({
        mutationFn: (fields) => createRecords(tableId, {
            records: [{ fields }],
            fieldKeyType: FieldKeyType.Id,
        }),
        onSuccess: (data) => {
            setOpen(false);
            callback?.(data.data.records[0].id);
        },
    });
    const newRecord = useCallback((version = 0, initData = {}) => {
        setRecord((preRecord) => {
            const record = createRecordInstance({
                id: '',
                fields: version > 0 && preRecord?.fields ? preRecord.fields : initData,
            });
            record.updateCell = (fieldId, newValue) => {
                record.fields[fieldId] = newValue;
                updateVersion.inc();
                return Promise.resolve();
            };
            return record;
        });
    }, [updateVersion]);
    useEffect(() => {
        if (!open) {
            updateVersion.reset();
            newRecord();
        }
    }, [newRecord, open, updateVersion]);
    useEffect(() => {
        // init record
        newRecord();
    }, [newRecord]);
    useEffect(() => {
        if (version > 0) {
            newRecord(version);
        }
    }, [version, newRecord]);
    useEffect(() => {
        if (!allFields.length) {
            return;
        }
        setRecord((record) => record
            ? recordInstanceFieldMap(record, allFields.reduce((acc, field) => {
                acc[field.id] = field;
                return acc;
            }, {}))
            : record);
    }, [allFields, record]);
    useEffect(() => {
        if (!open)
            return;
        const updateDefaultValue = async () => {
            const fieldValue = await extractDefaultFieldsFromFilters({
                filter,
                fieldMap: keyBy(allFields, 'id'),
                currentUserId: userId,
                baseId,
                tableId,
                isAsync: true,
            });
            newRecord(0, fieldValue);
        };
        updateDefaultValue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    const showFieldsId = useMemo(() => new Set(showFields.filter((field) => field.canCreateFieldRecord).map((field) => field.id)), [showFields]);
    const fields = useMemo(() => viewId
        ? allFields
            .filter((field) => field.canCreateFieldRecord)
            .filter((field) => showFieldsId.has(field.id))
        : allFields, [allFields, showFieldsId, viewId]);
    const hiddenFields = useMemo(() => viewId
        ? allFields
            .filter((field) => field.canCreateFieldRecord)
            .filter((field) => !showFieldsId.has(field.id))
        : [], [allFields, showFieldsId, viewId]);
    const onChange = (newValue, fieldId) => {
        if (isEqual(record?.getCellValue(fieldId), newValue)) {
            return;
        }
        record?.updateCell(fieldId, newValue);
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: (val) => val && setOpen(val), children: [_jsx(DialogTrigger, { asChild: true, children: children }), _jsxs(DialogContent, { closeable: false, className: "flex h-full max-w-3xl flex-col p-0 pt-6", style: { width: 'calc(100% - 40px)', height: 'calc(100% - 100px)' }, onMouseDown: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation(), children: [_jsx("div", { className: "flex-1 overflow-y-auto p-10 pt-4", children: _jsx(RecordEditor, { record: record, fields: fields, hiddenFields: hiddenFields, onChange: onChange }) }), _jsxs("div", { className: "flex justify-end gap-4 border-t px-10 py-3", children: [_jsx(Button, { variant: 'outline', size: 'sm', onClick: () => setOpen(false), children: t('common.cancel') }), _jsxs(Button, { className: "relative overflow-hidden", size: 'sm', disabled: !tableId || isLoading, onClick: () => {
                                    createRecord(record?.fields ?? {});
                                }, children: [isLoading && (_jsx("div", { className: "absolute flex size-full items-center justify-center", children: _jsx(Spin, { className: "mr-2" }) })), t('common.create')] })] })] })] }));
};
