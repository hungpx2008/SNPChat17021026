import { useMutation } from '@tanstack/react-query';
import { createRecords as createRecordsApi, updateRecord as updateRecordApi, updateRecords as updateRecordsApi, duplicateRecord as duplicateRecordApi, updateRecordOrders as updateRecordOrdersApi, } from '@teable/openapi';
export const useRecordOperations = () => {
    const { mutateAsync: createRecords } = useMutation({
        mutationFn: ({ tableId, recordsRo }) => createRecordsApi(tableId, recordsRo),
    });
    const { mutateAsync: updateRecord } = useMutation({
        mutationFn: ({ tableId, recordId, recordRo, }) => updateRecordApi(tableId, recordId, recordRo),
    });
    const { mutateAsync: updateRecords } = useMutation({
        mutationFn: ({ tableId, recordsRo }) => updateRecordsApi(tableId, recordsRo),
    });
    const { mutateAsync: duplicateRecord } = useMutation({
        mutationFn: ({ tableId, recordId, order, }) => duplicateRecordApi(tableId, recordId, order),
    });
    const { mutateAsync: updateRecordOrders } = useMutation({
        mutationFn: ({ tableId, viewId, order, }) => updateRecordOrdersApi(tableId, viewId, order),
    });
    return { createRecords, updateRecord, updateRecords, duplicateRecord, updateRecordOrders };
};
