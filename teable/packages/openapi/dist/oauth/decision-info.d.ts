import { z } from '../zod';
export declare const DECISION_INFO_GET = "/oauth/decision/{transactionId}";
export declare const decisionInfoGetVoSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    homepage: z.ZodString;
    logo: z.ZodOptional<z.ZodString>;
    scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    homepage: string;
    description?: string | undefined;
    logo?: string | undefined;
    scopes?: string[] | undefined;
}, {
    name: string;
    homepage: string;
    description?: string | undefined;
    logo?: string | undefined;
    scopes?: string[] | undefined;
}>;
export type DecisionInfoGetVo = z.infer<typeof decisionInfoGetVoSchema>;
export declare const decisionInfoGetRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const decisionInfoGet: (transactionId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    homepage: string;
    description?: string | undefined;
    logo?: string | undefined;
    scopes?: string[] | undefined;
}, any>>;
