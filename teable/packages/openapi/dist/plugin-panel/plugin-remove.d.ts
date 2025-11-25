import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const PLUGIN_PANEL_REMOVE = "/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}";
export declare const pluginPanelRemoveRoute: RouteConfig;
export declare const removePluginPanelPlugin: (tableId: string, pluginPanelId: string, pluginInstallId: string) => Promise<import("axios").AxiosResponse<void, any>>;
