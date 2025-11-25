import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import type { TableIndex } from './toggle-table-index';
export declare const TABLE_ABNORMAL_INDEX = "/base/{baseId}/table/{tableId}/abnormal-index";
export declare const getAbnormalVoSchema: z.ZodArray<z.ZodObject<{
    indexName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    indexName: string;
}, {
    indexName: string;
}>, "many">;
export type IGetAbnormalVo = z.infer<typeof getAbnormalVoSchema>;
export declare const TableAbnormalIndexRoute: RouteConfig;
export declare const getTableAbnormalIndex: (baseId: string, tableId: string, type: TableIndex) => Promise<import("axios").AxiosResponse<{
    indexName: string;
}[], any>>;
