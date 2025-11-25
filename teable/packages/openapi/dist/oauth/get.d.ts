import { z } from '../zod';
export declare const OAUTH_GET = "/oauth/client/{clientId}";
export declare const oauthGetRoSchema: z.ZodObject<{
    clientId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    clientId: string;
}, {
    clientId: string;
}>;
export type OAuthGetRo = z.infer<typeof oauthGetRoSchema>;
export declare const oauthGetVoSchema: z.ZodObject<{
    clientId: z.ZodString;
    name: z.ZodString;
    secrets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        secret: z.ZodString;
        lastUsedTime: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        secret: string;
        lastUsedTime?: string | undefined;
    }, {
        id: string;
        secret: string;
        lastUsedTime?: string | undefined;
    }>, "many">>;
    scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    logo: z.ZodOptional<z.ZodString>;
    homepage: z.ZodString;
    redirectUris: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    clientId: string;
    homepage: string;
    redirectUris: string[];
    logo?: string | undefined;
    scopes?: string[] | undefined;
    secrets?: {
        id: string;
        secret: string;
        lastUsedTime?: string | undefined;
    }[] | undefined;
}, {
    name: string;
    clientId: string;
    homepage: string;
    redirectUris: string[];
    logo?: string | undefined;
    scopes?: string[] | undefined;
    secrets?: {
        id: string;
        secret: string;
        lastUsedTime?: string | undefined;
    }[] | undefined;
}>;
export type OAuthGetVo = z.infer<typeof oauthGetVoSchema>;
export declare const oauthGetRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const oauthGet: (clientId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    clientId: string;
    homepage: string;
    redirectUris: string[];
    logo?: string | undefined;
    scopes?: string[] | undefined;
    secrets?: {
        id: string;
        secret: string;
        lastUsedTime?: string | undefined;
    }[] | undefined;
}, any>>;
