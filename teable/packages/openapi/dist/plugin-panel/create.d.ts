import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PANEL_CREATE = "/table/{tableId}/plugin-panel";
export declare const pluginPanelCreateRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type IPluginPanelCreateRo = z.infer<typeof pluginPanelCreateRoSchema>;
export declare const pluginPanelCreateVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export type IPluginPanelCreateVo = z.infer<typeof pluginPanelCreateVoSchema>;
export declare const pluginPanelCreateRoute: RouteConfig;
export declare const createPluginPanel: (tableId: string, ro: IPluginPanelCreateRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
}, any>>;
