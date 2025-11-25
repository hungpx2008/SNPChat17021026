import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const VIEW_DESCRIPTION = "/table/{tableId}/view/{viewId}/description";
export declare const viewDescriptionRoSchema: z.ZodObject<{
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
}, {
    description: string;
}>;
export type IViewDescriptionRo = z.infer<typeof viewDescriptionRoSchema>;
export declare const updateViewDescriptionRoute: RouteConfig;
export declare const updateViewDescription: (tableId: string, viewId: string, data: IViewDescriptionRo) => Promise<import("axios").AxiosResponse<void, any>>;
