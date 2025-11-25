import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const PLUGIN_SUBMIT = "/plugin/{pluginId}/submit";
export declare const pluginSubmitRouter: RouteConfig;
export declare const submitPlugin: (pluginId: string) => Promise<import("axios").AxiosResponse<any, any>>;
