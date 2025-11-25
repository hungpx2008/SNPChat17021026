import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const ADMIN_PLUGIN_UNPUBLISH = "/admin/plugin/{pluginId}/unpublish";
export declare const adminUnpublishPluginRouter: RouteConfig;
export declare const adminUnpublishPlugin: (pluginId: string) => Promise<import("axios").AxiosResponse<any, any>>;
