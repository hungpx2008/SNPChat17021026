import { z } from '../zod';
export declare const REFRESH_ACCESS_TOKEN = "/access-token/{id}/refresh";
export declare const refreshAccessTokenRoSchema: z.ZodOptional<z.ZodObject<{
    expiredTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    expiredTime: string;
}, {
    expiredTime: string;
}>>;
export type RefreshAccessTokenRo = z.infer<typeof refreshAccessTokenRoSchema>;
export declare const refreshAccessTokenVoSchema: z.ZodObject<{
    id: z.ZodString;
    expiredTime: z.ZodString;
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    id: string;
    expiredTime: string;
}, {
    token: string;
    id: string;
    expiredTime: string;
}>;
export type RefreshAccessTokenVo = z.infer<typeof refreshAccessTokenVoSchema>;
export declare const accessTokenRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const refreshAccessToken: (id: string, body?: RefreshAccessTokenRo) => Promise<import("axios").AxiosResponse<{
    token: string;
    id: string;
    expiredTime: string;
}, any>>;
