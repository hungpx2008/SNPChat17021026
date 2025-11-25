import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_CONTEXT_MENU_REMOVE = "/table/{tableId}/plugin-context-menu/{pluginInstallId}";
export declare const pluginContextMenuRemoveRoSchema: z.ZodObject<{
    pluginContextMenuId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    pluginContextMenuId: string;
}, {
    pluginContextMenuId: string;
}>;
export type IPluginContextMenuRemoveRo = z.infer<typeof pluginContextMenuRemoveRoSchema>;
export declare const pluginContextMenuRemoveRoute: RouteConfig;
export declare const removePluginContextMenu: (tableId: string, pluginInstallId: string) => Promise<import("axios").AxiosResponse<void, any>>;
