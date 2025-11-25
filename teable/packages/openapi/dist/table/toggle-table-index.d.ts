import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const TOGGLE_TABLE_INDEX = "/base/{baseId}/table/{tableId}/index";
export declare enum TableIndex {
    search = "search"
}
export declare const RecommendedIndexRow = 10000;
export declare const tableIndexTypeSchema: z.ZodNativeEnum<typeof TableIndex>;
export type ITableIndexType = z.infer<typeof tableIndexTypeSchema>;
export declare const toggleIndexRoSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof TableIndex>;
}, "strip", z.ZodTypeAny, {
    type: TableIndex;
}, {
    type: TableIndex;
}>;
export type IToggleIndexRo = z.infer<typeof toggleIndexRoSchema>;
export declare const ToggleTableIndexRoute: RouteConfig;
export declare const toggleTableIndex: (baseId: string, tableId: string, toggleIndexRo: IToggleIndexRo) => Promise<import("axios").AxiosResponse<void, any>>;
