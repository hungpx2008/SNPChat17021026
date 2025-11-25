import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const VIEW_ORDER = "/table/{tableId}/view/{viewId}/order";
export declare const updateOrderRoSchema: z.ZodObject<{
    anchorId: z.ZodString;
    position: z.ZodEnum<["before", "after"]>;
}, "strip", z.ZodTypeAny, {
    anchorId: string;
    position: "before" | "after";
}, {
    anchorId: string;
    position: "before" | "after";
}>;
export type IUpdateOrderRo = z.infer<typeof updateOrderRoSchema>;
export declare const updateViewOrderRoute: RouteConfig;
export declare const updateViewOrder: (tableId: string, viewId: string, orderRo: IUpdateOrderRo) => Promise<import("axios").AxiosResponse<void, any>>;
