import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const TABLE_NAME = "/base/{baseId}/table/{tableId}/name";
export declare const tableNameRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type ITableNameRo = z.infer<typeof tableNameRoSchema>;
export declare const updateTableNameRoute: RouteConfig;
export declare const updateTableName: (baseId: string, tableId: string, data: ITableNameRo) => Promise<import("axios").AxiosResponse<void, any>>;
