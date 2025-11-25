import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const TABLE_ACTIVATED_INDEX = "/base/{baseId}/table/{tableId}/activated-index";
export declare const TableActivatedIndexRoute: RouteConfig;
export declare const getTableActivatedIndex: (baseId: string, tableId: string) => Promise<import("axios").AxiosResponse<import("./toggle-table-index").TableIndex.search[], any>>;
