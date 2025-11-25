import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLUGIN_REFRESH_TOKEN = "/plugin/{pluginId}/refreshToken";
export declare const pluginRefreshTokenRoSchema: z.ZodObject<{
    refreshToken: z.ZodString;
    secret: z.ZodString;
}, "strip", z.ZodTypeAny, {
    secret: string;
    refreshToken: string;
}, {
    secret: string;
    refreshToken: string;
}>;
export type IPluginRefreshTokenRo = z.infer<typeof pluginRefreshTokenRoSchema>;
export declare const pluginRefreshTokenVoSchema: z.ZodObject<{
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
export type IPluginRefreshTokenVo = z.infer<typeof pluginRefreshTokenVoSchema>;
export declare const PluginRefreshTokenRoute: RouteConfig;
export declare const pluginRefreshToken: (pluginId: string, ro: IPluginRefreshTokenRo) => Promise<import("axios").AxiosResponse<{
    scopes: string[];
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}, any>>;
