import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DASHBOARD_INSTALL_PLUGIN = "/base/{baseId}/dashboard/{id}/plugin";
export declare const dashboardInstallPluginRoSchema: z.ZodObject<{
    name: z.ZodString;
    pluginId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    pluginId: string;
}, {
    name: string;
    pluginId: string;
}>;
export type IDashboardInstallPluginRo = z.infer<typeof dashboardInstallPluginRoSchema>;
export declare const dashboardInstallPluginVoSchema: z.ZodObject<{
    id: z.ZodString;
    pluginId: z.ZodString;
    pluginInstallId: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    pluginInstallId: string;
    pluginId: string;
}, {
    name: string;
    id: string;
    pluginInstallId: string;
    pluginId: string;
}>;
export type IDashboardInstallPluginVo = z.infer<typeof dashboardInstallPluginVoSchema>;
export declare const DashboardInstallPluginRoute: RouteConfig;
export declare const installPlugin: (baseId: string, id: string, ro: IDashboardInstallPluginRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    pluginInstallId: string;
    pluginId: string;
}, any>>;
