import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PANEL_UPDATE_STORAGE = "/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}/update-storage";
export declare const pluginPanelUpdateStorageRoSchema: z.ZodObject<{
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    storage?: Record<string, unknown> | undefined;
}, {
    storage?: Record<string, unknown> | undefined;
}>;
export type IPluginPanelUpdateStorageRo = z.infer<typeof pluginPanelUpdateStorageRoSchema>;
export declare const pluginPanelUpdateStorageVoSchema: z.ZodObject<{
    tableId: z.ZodString;
    pluginPanelId: z.ZodString;
    pluginInstallId: z.ZodString;
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tableId: string;
    pluginInstallId: string;
    pluginPanelId: string;
    storage?: Record<string, unknown> | undefined;
}, {
    tableId: string;
    pluginInstallId: string;
    pluginPanelId: string;
    storage?: Record<string, unknown> | undefined;
}>;
export type IPluginPanelUpdateStorageVo = z.infer<typeof pluginPanelUpdateStorageVoSchema>;
export declare const pluginPanelUpdateStorageRoute: RouteConfig;
export declare const updatePluginPanelStorage: (tableId: string, pluginPanelId: string, pluginInstallId: string, ro: IPluginPanelUpdateStorageRo) => Promise<import("axios").AxiosResponse<{
    tableId: string;
    pluginInstallId: string;
    pluginPanelId: string;
    storage?: Record<string, unknown> | undefined;
}, any>>;
