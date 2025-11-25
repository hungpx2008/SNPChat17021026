import { z } from '../zod';
export declare const PLUGIN_GET_AUTH_CODE = "/plugin/{pluginId}/authCode";
export declare const pluginGetAuthCodeRoSchema: z.ZodObject<{
    baseId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    baseId: string;
}, {
    baseId: string;
}>;
export declare const pluginGetAuthCodeRouter: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const pluginGetAuthCode: (pluginId: string, baseId: string) => Promise<import("axios").AxiosResponse<string, any>>;
