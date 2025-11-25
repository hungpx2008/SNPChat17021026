import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_VIEW_INSTALL_PLUGIN = "/table/{tableId}/view/{viewId}/plugin";
export declare const getViewInstallPluginVoSchema: z.ZodObject<{
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
    baseId: z.ZodString;
    name: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    baseId: string;
    pluginInstallId: string;
    pluginId: string;
    url?: string | undefined;
    storage?: Record<string, unknown> | undefined;
}, {
    name: string;
    baseId: string;
    pluginInstallId: string;
    pluginId: string;
    url?: string | undefined;
    storage?: Record<string, unknown> | undefined;
}>;
export type IGetViewInstallPluginVo = z.infer<typeof getViewInstallPluginVoSchema>;
export declare const GetViewInstallPluginRoute: RouteConfig;
export declare const getViewInstallPlugin: (tableId: string, viewId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    baseId: string;
    pluginInstallId: string;
    pluginId: string;
    url?: string | undefined;
    storage?: Record<string, unknown> | undefined;
}, any>>;
