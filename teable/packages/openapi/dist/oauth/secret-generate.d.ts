import { z } from '../zod';
export declare const OAUTH_SECRET_GENERATE = "/oauth/client/{clientId}/secret";
export declare const generateOAuthSecretVoSchema: z.ZodObject<{
    id: z.ZodString;
    secret: z.ZodString;
    maskedSecret: z.ZodString;
    lastUsedTime: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    secret: string;
    maskedSecret: string;
    lastUsedTime?: string | undefined;
}, {
    id: string;
    secret: string;
    maskedSecret: string;
    lastUsedTime?: string | undefined;
}>;
export type GenerateOAuthSecretVo = z.infer<typeof generateOAuthSecretVoSchema>;
export declare const generateOAuthSecretRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const generateOAuthSecret: (clientId: string) => Promise<import("axios").AxiosResponse<{
    id: string;
    secret: string;
    maskedSecret: string;
    lastUsedTime?: string | undefined;
}, any>>;
