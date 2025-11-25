import { z } from '../zod';
export declare const OAUTH_UPDATE = "/oauth/client/{clientId}";
export declare const oauthUpdateRoSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    homepage: z.ZodString;
    logo: z.ZodOptional<z.ZodString>;
    scopes: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodNativeEnum<any>, "many">, string[], any[]>>;
    redirectUris: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    homepage: string;
    redirectUris: string[];
    description?: string | undefined;
    logo?: string | undefined;
    scopes?: string[] | undefined;
}, {
    name: string;
    homepage: string;
    redirectUris: string[];
    description?: string | undefined;
    logo?: string | undefined;
    scopes?: any[] | undefined;
}>;
export type OAuthUpdateRo = z.infer<typeof oauthUpdateRoSchema>;
export declare const oauthUpdateVoSchema: z.ZodObject<{
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
export type OAuthUpdateVo = z.infer<typeof oauthUpdateVoSchema>;
export declare const oauthUpdateRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const oauthUpdate: (clientId: string, oauthRo: OAuthUpdateRo) => Promise<import("axios").AxiosResponse<{
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
