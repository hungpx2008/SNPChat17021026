import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DUPLICATE_PANEL_INSTALLED_PLUGIN = "/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{installedId}/duplicate";
export declare const duplicatePluginPanelInstalledPluginRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export type IDuplicatePluginPanelInstalledPluginRo = z.infer<typeof duplicatePluginPanelInstalledPluginRoSchema>;
export declare const duplicatePluginPanelInstalledPluginRoute: RouteConfig;
export declare const duplicatePluginPanelInstalledPlugin: (tableId: string, pluginPanelId: string, installedId: string, duplicatePluginPanelRo: IDuplicatePluginPanelInstalledPluginRo) => Promise<import("axios").AxiosResponse<{
    id: string;
    name: string;
}, any>>;
