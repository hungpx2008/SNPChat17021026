import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DASHBOARD_PLUGIN_RENAME = "/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}/rename";
export declare const dashboardPluginRenameRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type IDashboardPluginRenameRo = z.infer<typeof dashboardPluginRenameRoSchema>;
export declare const dashboardPluginRenameVoSchema: z.ZodObject<{
    id: z.ZodString;
    pluginInstallId: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    pluginInstallId: string;
}, {
    name: string;
    id: string;
    pluginInstallId: string;
}>;
export type IDashboardPluginRenameVo = z.infer<typeof dashboardPluginRenameVoSchema>;
export declare const DashboardPluginRenameRoute: RouteConfig;
export declare const renamePlugin: (baseId: string, dashboardId: string, pluginInstallId: string, name: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    pluginInstallId: string;
}, any>>;
