import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IPluginInstallStorage } from '../dashboard';
import { z } from '../zod';
export declare const VIEW_PLUGIN_UPDATE_STORAGE = "/table/{tableId}/view/{viewId}/plugin/{pluginInstallId}";
export declare const viewPluginUpdateStorageRoSchema: z.ZodObject<{
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    storage?: Record<string, unknown> | undefined;
}, {
    storage?: Record<string, unknown> | undefined;
}>;
export type IViewPluginUpdateStorageRo = z.infer<typeof viewPluginUpdateStorageRoSchema>;
export declare const viewPluginUpdateStorageVoSchema: z.ZodObject<{
    tableId: z.ZodString;
    viewId: z.ZodString;
    pluginInstallId: z.ZodString;
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tableId: string;
    viewId: string;
    pluginInstallId: string;
    storage?: Record<string, unknown> | undefined;
}, {
    tableId: string;
    viewId: string;
    pluginInstallId: string;
    storage?: Record<string, unknown> | undefined;
}>;
export type IViewPluginUpdateStorageVo = z.infer<typeof viewPluginUpdateStorageVoSchema>;
export declare const ViewPluginUpdateStorageRoute: RouteConfig;
export declare const updateViewPluginStorage: (tableId: string, viewId: string, pluginInstallId: string, storage?: IPluginInstallStorage) => Promise<import("axios").AxiosResponse<{
    tableId: string;
    viewId: string;
    pluginInstallId: string;
    storage?: Record<string, unknown> | undefined;
}, any>>;
