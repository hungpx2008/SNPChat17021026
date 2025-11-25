import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PANEL_PLUGIN_RENAME = "/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}/rename";
export declare const pluginPanelPluginRenameRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type IPluginPanelPluginRenameRo = z.infer<typeof pluginPanelPluginRenameRoSchema>;
export declare const pluginPanelPluginRenameVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export type IPluginPanelPluginRenameVo = z.infer<typeof pluginPanelPluginRenameVoSchema>;
export declare const pluginPanelPluginRenameRoute: RouteConfig;
export declare const renamePluginPanelPlugin: (tableId: string, pluginPanelId: string, pluginInstallId: string, name: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
}, any>>;
