import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DELETE_PLUGIN = "/plugin/{id}";
export declare const deletePluginRoSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type IDeletePluginRo = z.infer<typeof deletePluginRoSchema>;
export declare const DeletePluginRoute: RouteConfig;
export declare const deletePlugin: (id: string) => Promise<import("axios").AxiosResponse<void, any>>;
