import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PANEL_PLUGIN_GET = "/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}";
export declare const pluginPanelPluginGetRoSchema: z.ZodObject<{
    tableId: z.ZodString;
    pluginPanelId: z.ZodString;
    pluginId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tableId: string;
    pluginId: string;
    pluginPanelId: string;
}, {
    tableId: string;
    pluginId: string;
    pluginPanelId: string;
}>;
export declare const pluginPanelPluginGetVoSchema: z.ZodObject<{
    baseId: z.ZodString;
    name: z.ZodString;
    tableId: z.ZodString;
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    tableId: string;
    baseId: string;
    pluginInstallId: string;
    pluginId: string;
    storage?: Record<string, unknown> | undefined;
}, {
    name: string;
    tableId: string;
    baseId: string;
    pluginInstallId: string;
    pluginId: string;
    storage?: Record<string, unknown> | undefined;
}>;
export type IPluginPanelPluginGetVo = z.infer<typeof pluginPanelPluginGetVoSchema>;
export declare const pluginPanelPluginGetRoute: RouteConfig;
export declare const getPluginPanelPlugin: (tableId: string, pluginPanelId: string, pluginInstallId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    tableId: string;
    baseId: string;
    pluginInstallId: string;
    pluginId: string;
    storage?: Record<string, unknown> | undefined;
}, any>>;
