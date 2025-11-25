import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const ADMIN_PLUGIN_PUBLISH = "/admin/plugin/{pluginId}/publish";
export declare const adminPluginPublishRoute: RouteConfig;
export declare const publishPlugin: (pluginId: string) => Promise<import("axios").AxiosResponse<any, any>>;
