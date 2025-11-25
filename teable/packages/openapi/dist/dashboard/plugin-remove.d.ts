import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DASHBOARD_REMOVE_PLUGIN = "/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}";
export declare const DashboardRemovePluginRoute: RouteConfig;
export declare const removePlugin: (baseId: string, dashboardId: string, pluginInstallId: string) => Promise<import("axios").AxiosResponse<any, any>>;
