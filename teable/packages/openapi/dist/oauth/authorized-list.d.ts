import { z } from '../zod';
export declare const AUTHORIZED_LIST = "/oauth/client/authorized/list";
export declare const authorizedVoSchema: z.ZodObject<{
    clientId: z.ZodString;
    name: z.ZodString;
    homepage: z.ZodString;
    logo: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    lastUsedTime: z.ZodOptional<z.ZodString>;
    createdUser: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
    }, {
        name: string;
        email: string;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    clientId: string;
    homepage: string;
    createdUser: {
        name: string;
        email: string;
    };
    description?: string | undefined;
    logo?: string | undefined;
    scopes?: string[] | undefined;
    lastUsedTime?: string | undefined;
}, {
    name: string;
    clientId: string;
    homepage: string;
    createdUser: {
        name: string;
        email: string;
    };
    description?: string | undefined;
    logo?: string | undefined;
    scopes?: string[] | undefined;
    lastUsedTime?: string | undefined;
}>;
export type AuthorizedVo = z.infer<typeof authorizedVoSchema>;
export declare const authorizedListRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const getAuthorizedList: () => Promise<import("axios").AxiosResponse<{
    name: string;
    clientId: string;
    homepage: string;
    createdUser: {
        name: string;
        email: string;
    };
    description?: string | undefined;
    logo?: string | undefined;
    scopes?: string[] | undefined;
    lastUsedTime?: string | undefined;
}[], any>>;
