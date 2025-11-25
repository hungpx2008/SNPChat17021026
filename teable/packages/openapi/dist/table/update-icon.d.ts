import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const TABLE_ICON = "/base/{baseId}/table/{tableId}/icon";
export declare const tableIconRoSchema: z.ZodObject<{
    icon: z.ZodString;
}, "strip", z.ZodTypeAny, {
    icon: string;
}, {
    icon: string;
}>;
export type ITableIconRo = z.infer<typeof tableIconRoSchema>;
export declare const updateTableIconRoute: RouteConfig;
export declare const updateTableIcon: (baseId: string, tableId: string, data: ITableIconRo) => Promise<import("axios").AxiosResponse<void, any>>;
