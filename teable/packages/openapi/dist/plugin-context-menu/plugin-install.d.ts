import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_CONTEXT_MENU_INSTALL = "/table/{tableId}/plugin-context-menu/install";
export declare const pluginContextMenuInstallRoSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    pluginId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    pluginId: string;
    name?: string | undefined;
}, {
    pluginId: string;
    name?: string | undefined;
}>;
export type IPluginContextMenuInstallRo = z.infer<typeof pluginContextMenuInstallRoSchema>;
export declare const pluginContextMenuInstallVoSchema: z.ZodObject<{
    pluginInstallId: z.ZodString;
    name: z.ZodString;
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    order: number;
    pluginInstallId: string;
}, {
    name: string;
    order: number;
    pluginInstallId: string;
}>;
export type IPluginContextMenuInstallVo = z.infer<typeof pluginContextMenuInstallVoSchema>;
export declare const pluginContextMenuInstallRoute: RouteConfig;
export declare const installPluginContextMenu: (tableId: string, ro: IPluginContextMenuInstallRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    order: number;
    pluginInstallId: string;
}, any>>;
