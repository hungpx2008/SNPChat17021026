import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const VIEW_LOCKED = "/table/{tableId}/view/{viewId}/locked";
export declare const viewLockedRoSchema: z.ZodObject<{
    isLocked: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isLocked?: boolean | undefined;
}, {
    isLocked?: boolean | undefined;
}>;
export type IViewLockedRo = z.infer<typeof viewLockedRoSchema>;
export declare const updateViewLockedRoute: RouteConfig;
export declare const updateViewLocked: (tableId: string, viewId: string, data: IViewLockedRo) => Promise<import("axios").AxiosResponse<void, any>>;
