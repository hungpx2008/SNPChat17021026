import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_GET_TOKEN = "/plugin/{pluginId}/token";
export declare const pluginGetTokenRoSchema: z.ZodObject<{
    baseId: z.ZodString;
    secret: z.ZodString;
    scopes: z.ZodArray<z.ZodString, "many">;
    authCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    baseId: string;
    secret: string;
    scopes: string[];
    authCode: string;
}, {
    baseId: string;
    secret: string;
    scopes: string[];
    authCode: string;
}>;
export type IPluginGetTokenRo = z.infer<typeof pluginGetTokenRoSchema>;
export declare const pluginGetTokenVoSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    scopes: z.ZodArray<z.ZodString, "many">;
    expiresIn: z.ZodNumber;
    refreshExpiresIn: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    scopes: string[];
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}, {
    scopes: string[];
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}>;
export type IPluginGetTokenVo = z.infer<typeof pluginGetTokenVoSchema>;
export declare const PluginGetTokenRoute: RouteConfig;
export declare const pluginGetToken: (pluginId: string, ro: IPluginGetTokenRo) => Promise<import("axios").AxiosResponse<{
    scopes: string[];
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}, any>>;
