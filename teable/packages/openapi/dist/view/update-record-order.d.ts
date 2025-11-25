import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const updateRecordOrdersRoSchema: z.ZodObject<{
    anchorId: z.ZodString;
    position: z.ZodEnum<["before", "after"]>;
    recordIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    anchorId: string;
    position: "before" | "after";
    recordIds: string[];
}, {
    anchorId: string;
    position: "before" | "after";
    recordIds: string[];
}>;
export type IUpdateRecordOrdersRo = z.infer<typeof updateRecordOrdersRoSchema>;
export declare const RECORD_ORDER = "/table/{tableId}/view/{viewId}/record-order";
export declare const updateRecordOrdersRoute: RouteConfig;
export declare const updateRecordOrders: (tableId: string, viewId: string, orderRo: IUpdateRecordOrdersRo) => Promise<import("axios").AxiosResponse<void, any>>;
