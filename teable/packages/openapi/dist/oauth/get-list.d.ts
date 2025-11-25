import { z } from '../zod';
export declare const OAUTH_GET_LIST = "/oauth/client";
export declare const oauthGetListVoSchema: z.ZodArray<z.ZodObject<{
    clientId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    logo: z.ZodOptional<z.ZodString>;
    homepage: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    clientId: string;
    homepage: string;
    description?: string | undefined;
    logo?: string | undefined;
}, {
    name: string;
    clientId: string;
    homepage: string;
    description?: string | undefined;
    logo?: string | undefined;
}>, "many">;
export type OAuthGetListVo = z.infer<typeof oauthGetListVoSchema>;
export declare const oauthGetListRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const oauthGetList: () => Promise<import("axios").AxiosResponse<{
    name: string;
    clientId: string;
    homepage: string;
    description?: string | undefined;
    logo?: string | undefined;
}[], any>>;
