import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PANEL_INSTALL = "/table/{tableId}/plugin-panel/{pluginPanelId}/install";
export declare const pluginPanelInstallRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    pluginId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    pluginId: string;
    name?: string | undefined;
}, {
    pluginId: string;
    name?: string | undefined;
}>;
export type IPluginPanelInstallRo = z.infer<typeof pluginPanelInstallRoSchema>;
export declare const pluginPanelInstallVoSchema: z.ZodObject<{
    name: z.ZodString;
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    pluginInstallId: string;
    pluginId: string;
}, {
    name: string;
    pluginInstallId: string;
    pluginId: string;
}>;
export type IPluginPanelInstallVo = z.infer<typeof pluginPanelInstallVoSchema>;
export declare const pluginPanelInstallRoute: RouteConfig;
export declare const installPluginPanel: (tableId: string, pluginPanelId: string, ro: IPluginPanelInstallRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    pluginInstallId: string;
    pluginId: string;
}, any>>;
