import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const PLUGIN_PANEL_DELETE = "/table/{tableId}/plugin-panel/{pluginPanelId}";
export declare const pluginPanelDeleteRoute: RouteConfig;
export declare const deletePluginPanel: (tableId: string, pluginPanelId: string) => Promise<import("axios").AxiosResponse<void, any>>;
