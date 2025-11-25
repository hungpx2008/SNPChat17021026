import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { TableIndex } from './toggle-table-index';
export declare const TABLE_INDEX_REPAIR = "/base/{baseId}/table/{tableId}/index/repair";
export declare const TableIndexRepairRoute: RouteConfig;
export declare const repairTableIndex: (baseId: string, tableId: string, type: TableIndex) => Promise<import("axios").AxiosResponse<void, any>>;
