import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DB_TABLE_NAME = "/base/{baseId}/table/{tableId}/db-table-name";
export declare const dbTableNameRoSchema: z.ZodObject<{
    dbTableName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    dbTableName: string;
}, {
    dbTableName: string;
}>;
export type IDbTableNameRo = z.infer<typeof dbTableNameRoSchema>;
export declare const updateDbTableNameRoute: RouteConfig;
export declare const updateDbTableName: (baseId: string, tableId: string, data: IDbTableNameRo) => Promise<import("axios").AxiosResponse<void, any>>;
