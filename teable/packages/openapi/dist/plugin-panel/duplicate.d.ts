import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_PlUGIN_PANEL_DUPLICATE = "/table/{tableId}/plugin-panel/{pluginPanelId}/duplicate";
export declare const duplicatePluginPanelRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export type IDuplicatePluginPanelRo = z.infer<typeof duplicatePluginPanelRoSchema>;
export declare const duplicatePluginPanelRoute: RouteConfig;
export declare const duplicatePluginPanel: (tableId: string, pluginPanelId: string, duplicatePluginPanelRo: IDuplicatePluginPanelRo) => Promise<import("axios").AxiosResponse<{
    id: string;
    name: string;
}, any>>;
