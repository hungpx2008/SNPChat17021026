import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const GET_TABLE = "/base/{baseId}/table/{tableId}";
export declare const GetTableRoute: RouteConfig;
export declare const getTableById: (baseId: string, tableId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    dbTableName: string;
    description?: string | undefined;
    order?: number | undefined;
    icon?: string | undefined;
    lastModifiedTime?: string | undefined;
    defaultViewId?: string | undefined;
}, any>>;
