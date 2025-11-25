import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_TABLE = "/base/{baseId}/table/{tableId}";
export declare const DeleteTableRoute: RouteConfig;
export declare const deleteTable: (baseId: string, tableId: string) => Promise<import("axios").AxiosResponse<null, any>>;
