import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const PERMANENT_DELETE_TABLE = "/base/{baseId}/table/{tableId}/permanent";
export declare const PermanentDeleteTableRoute: RouteConfig;
export declare const permanentDeleteTable: (baseId: string, tableId: string) => Promise<import("axios").AxiosResponse<null, any>>;
