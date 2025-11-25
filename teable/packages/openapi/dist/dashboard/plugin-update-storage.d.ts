import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import type { IPluginInstallStorage } from './types';
export declare const DASHBOARD_PLUGIN_UPDATE_STORAGE = "/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}/update-storage";
export declare const dashboardPluginUpdateStorageRoSchema: z.ZodObject<{
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    storage?: Record<string, unknown> | undefined;
}, {
    storage?: Record<string, unknown> | undefined;
}>;
export type IDashboardPluginUpdateStorageRo = z.infer<typeof dashboardPluginUpdateStorageRoSchema>;
export declare const dashboardPluginUpdateStorageVoSchema: z.ZodObject<{
    baseId: z.ZodString;
    dashboardId: z.ZodString;
    pluginInstallId: z.ZodString;
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    baseId: string;
    pluginInstallId: string;
    dashboardId: string;
    storage?: Record<string, unknown> | undefined;
}, {
    baseId: string;
    pluginInstallId: string;
    dashboardId: string;
    storage?: Record<string, unknown> | undefined;
}>;
export type IDashboardPluginUpdateStorageVo = z.infer<typeof dashboardPluginUpdateStorageVoSchema>;
export declare const DashboardPluginUpdateStorageRoute: RouteConfig;
export declare const updateDashboardPluginStorage: (baseId: string, dashboardId: string, pluginInstallId: string, storage?: IPluginInstallStorage) => Promise<import("axios").AxiosResponse<{
    baseId: string;
    pluginInstallId: string;
    dashboardId: string;
    storage?: Record<string, unknown> | undefined;
}, any>>;
