import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_CONTEXT_MENU_GET_STORAGE = "/table/{tableId}/plugin-context-menu/{pluginInstallId}/storage";
export declare const pluginContextMenuGetStorageVoSchema: z.ZodObject<{
    name: z.ZodString;
    tableId: z.ZodString;
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
    storage: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    name: string;
    tableId: string;
    pluginInstallId: string;
    pluginId: string;
    storage: Record<string, unknown>;
}, {
    name: string;
    tableId: string;
    pluginInstallId: string;
    pluginId: string;
    storage: Record<string, unknown>;
}>;
export type IPluginContextMenuGetStorageVo = z.infer<typeof pluginContextMenuGetStorageVoSchema>;
export declare const pluginContextMenuGetStorageRoute: RouteConfig;
export declare const getPluginContextMenuStorage: (tableId: string, pluginInstallId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    tableId: string;
    pluginInstallId: string;
    pluginId: string;
    storage: Record<string, unknown>;
}, any>>;
