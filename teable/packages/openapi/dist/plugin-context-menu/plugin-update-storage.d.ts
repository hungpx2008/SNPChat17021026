import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_CONTEXT_MENU_UPDATE_STORAGE = "/table/{tableId}/plugin-context-menu/{pluginInstallId}/update-storage";
export declare const pluginContextMenuUpdateStorageRoSchema: z.ZodObject<{
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    storage?: Record<string, unknown> | undefined;
}, {
    storage?: Record<string, unknown> | undefined;
}>;
export type IPluginContextMenuUpdateStorageRo = z.infer<typeof pluginContextMenuUpdateStorageRoSchema>;
export declare const pluginContextMenuUpdateStorageVoSchema: z.ZodObject<{
    tableId: z.ZodString;
    pluginInstallId: z.ZodString;
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tableId: string;
    pluginInstallId: string;
    storage?: Record<string, unknown> | undefined;
}, {
    tableId: string;
    pluginInstallId: string;
    storage?: Record<string, unknown> | undefined;
}>;
export type IPluginContextMenuUpdateStorageVo = z.infer<typeof pluginContextMenuUpdateStorageVoSchema>;
export declare const pluginContextMenuUpdateStorageRoute: RouteConfig;
export declare const updatePluginContextMenuStorage: (tableId: string, pluginInstallId: string, ro: IPluginContextMenuUpdateStorageRo) => Promise<import("axios").AxiosResponse<{
    tableId: string;
    pluginInstallId: string;
    storage?: Record<string, unknown> | undefined;
}, any>>;
