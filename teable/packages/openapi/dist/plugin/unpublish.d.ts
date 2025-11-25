import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const UNPUBLISH_PLUGIN = "/plugin/{pluginId}/unpublish";
export declare const unpublishPluginRouter: RouteConfig;
export declare const unpublishPlugin: (pluginId: string) => Promise<import("axios").AxiosResponse<any, any>>;
