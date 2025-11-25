import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const VIEW_NAME = "/table/{tableId}/view/{viewId}/name";
export declare const viewNameRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type IViewNameRo = z.infer<typeof viewNameRoSchema>;
export declare const updateViewNameRoute: RouteConfig;
export declare const updateViewName: (tableId: string, viewId: string, data: IViewNameRo) => Promise<import("axios").AxiosResponse<void, any>>;
