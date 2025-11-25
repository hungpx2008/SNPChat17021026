import type { IRecordInsertOrderRo } from './create';
export declare const DUPLICATE_URL = "/table/{tableId}/record/{recordId}/duplicate";
export declare const duplicateRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const duplicateRecord: (tableId: string, recordId: string, order: IRecordInsertOrderRo) => Promise<import("axios").AxiosResponse<{
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
}, any>>;
