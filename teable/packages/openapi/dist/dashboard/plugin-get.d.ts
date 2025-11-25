import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_DASHBOARD_INSTALL_PLUGIN = "/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}";
export declare const getDashboardInstallPluginRoSchema: z.ZodObject<{
    baseId: z.ZodString;
    dashboardId: z.ZodString;
    pluginInstallId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    baseId: string;
    pluginInstallId: string;
    dashboardId: string;
}, {
    baseId: string;
    pluginInstallId: string;
    dashboardId: string;
}>;
export declare const getDashboardInstallPluginVoSchema: z.ZodObject<{
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
    baseId: z.ZodString;
    name: z.ZodString;
    storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    baseId: string;
    pluginInstallId: string;
    pluginId: string;
    storage?: Record<string, unknown> | undefined;
}, {
    name: string;
    baseId: string;
    pluginInstallId: string;
    pluginId: string;
    storage?: Record<string, unknown> | undefined;
}>;
export type IGetDashboardInstallPluginVo = z.infer<typeof getDashboardInstallPluginVoSchema>;
export declare const GetDashboardInstallPluginRoute: RouteConfig;
export declare const getDashboardInstallPlugin: (baseId: string, dashboardId: string, pluginInstallId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    baseId: string;
    pluginInstallId: string;
    pluginId: string;
    storage?: Record<string, unknown> | undefined;
}, any>>;
