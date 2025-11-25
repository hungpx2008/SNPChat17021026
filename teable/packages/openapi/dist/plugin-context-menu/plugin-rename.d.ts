import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_CONTEXT_MENU_RENAME = "/table/{tableId}/plugin-context-menu/{pluginInstallId}/rename";
export declare const pluginContextMenuRenameRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type IPluginContextMenuRenameRo = z.infer<typeof pluginContextMenuRenameRoSchema>;
export declare const pluginContextMenuRenameVoSchema: z.ZodObject<{
    pluginInstallId: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    pluginInstallId: string;
}, {
    name: string;
    pluginInstallId: string;
}>;
export type IPluginContextMenuRenameVo = z.infer<typeof pluginContextMenuRenameVoSchema>;
export declare const pluginContextMenuRenameRoute: RouteConfig;
export declare const renamePluginContextMenu: (tableId: string, pluginInstallId: string, ro: IPluginContextMenuRenameRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    pluginInstallId: string;
}, any>>;
