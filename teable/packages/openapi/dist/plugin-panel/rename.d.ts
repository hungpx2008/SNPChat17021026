import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PANEL_RENAME = "/table/{tableId}/plugin-panel/{pluginPanelId}/rename";
export declare const pluginPanelRenameRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type IPluginPanelRenameRo = z.infer<typeof pluginPanelRenameRoSchema>;
export declare const pluginPanelRenameVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export type IPluginPanelRenameVo = z.infer<typeof pluginPanelRenameVoSchema>;
export declare const pluginPanelRenameRoute: RouteConfig;
export declare const renamePluginPanel: (tableId: string, pluginPanelId: string, ro: IPluginPanelRenameRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
}, any>>;
