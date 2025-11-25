import type { ICreateRecordsRo, IRecordInsertOrderRo, IUpdateRecordOrdersRo, IUpdateRecordRo, IUpdateRecordsRo } from '@teable/openapi';
export declare const useRecordOperations: () => {
    createRecords: import("@tanstack/react-query").UseMutateAsyncFunction<import("axios").AxiosResponse<{
        records: {
            id: string;
            fields: Record<string, unknown>;
            createdTime?: string | undefined;
            lastModifiedTime?: string | undefined;
            createdBy?: string | undefined;
            lastModifiedBy?: string | undefined;
            autoNumber?: number | undefined;
            name?: string | undefined;
            permissions?: Record<string, Record<string, boolean>> | undefined;
            undeletable?: boolean | undefined;
        }[];
    }, any>, unknown, {
        tableId: string;
        recordsRo: ICreateRecordsRo;
    }, unknown>;
    updateRecord: import("@tanstack/react-query").UseMutateAsyncFunction<import("axios").AxiosResponse<{
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }, any>, unknown, {
        tableId: string;
        recordId: string;
        recordRo: IUpdateRecordRo;
    }, unknown>;
    updateRecords: import("@tanstack/react-query").UseMutateAsyncFunction<import("axios").AxiosResponse<{
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }[], any>, unknown, {
        tableId: string;
        recordsRo: IUpdateRecordsRo;
    }, unknown>;
    duplicateRecord: import("@tanstack/react-query").UseMutateAsyncFunction<import("axios").AxiosResponse<{
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }, any>, unknown, {
        tableId: string;
        recordId: string;
        order: IRecordInsertOrderRo;
    }, unknown>;
    updateRecordOrders: import("@tanstack/react-query").UseMutateAsyncFunction<import("axios").AxiosResponse<void, any>, unknown, {
        tableId: string;
        viewId: string;
        order: IUpdateRecordOrdersRo;
    }, unknown>;
};
