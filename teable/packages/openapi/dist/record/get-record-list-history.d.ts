import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IGetRecordHistoryQuery } from './get-record-history';
export declare const GET_RECORD_LIST_HISTORY_URL = "/table/{tableId}/record/history";
export declare const GetRecordListHistoryRoute: RouteConfig;
export declare const getRecordListHistory: (tableId: string, query: IGetRecordHistoryQuery) => Promise<import("axios").AxiosResponse<{
    userMap: Record<string, {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    }>;
    historyList: {
        tableId: string;
        recordId: string;
        id: string;
        fieldId: string;
        before: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        after: {
            meta: {
                name: string;
                type: import("@teable/core").FieldType;
                cellValueType: import("@teable/core").CellValueType;
                options?: unknown;
                isLookup?: boolean | undefined;
                isConditionalLookup?: boolean | undefined;
            };
            data?: unknown;
        };
        createdBy: string;
        createdTime: string;
    }[];
    nextCursor?: string | null | undefined;
}, any>>;
