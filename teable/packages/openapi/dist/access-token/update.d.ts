import { z } from '../zod';
export declare const UPDATE_ACCESS_TOKEN = "/access-token/{id}";
export declare const updateAccessTokenRoSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    scopes: z.ZodArray<z.ZodString, "many">;
    spaceIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    baseIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    hasFullAccess: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    scopes: string[];
    description?: string | undefined;
    spaceIds?: string[] | null | undefined;
    baseIds?: string[] | null | undefined;
    hasFullAccess?: boolean | undefined;
}, {
    name: string;
    scopes: string[];
    description?: string | undefined;
    spaceIds?: string[] | null | undefined;
    baseIds?: string[] | null | undefined;
    hasFullAccess?: boolean | undefined;
}>;
export type UpdateAccessTokenRo = z.infer<typeof updateAccessTokenRoSchema>;
export declare const updateAccessTokenVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    scopes: z.ZodArray<z.ZodString, "many">;
    spaceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    baseIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    hasFullAccess: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    scopes: string[];
    description?: string | undefined;
    spaceIds?: string[] | undefined;
    baseIds?: string[] | undefined;
    hasFullAccess?: boolean | undefined;
}, {
    name: string;
    id: string;
    scopes: string[];
    description?: string | undefined;
    spaceIds?: string[] | undefined;
    baseIds?: string[] | undefined;
    hasFullAccess?: boolean | undefined;
}>;
export type UpdateAccessTokenVo = z.infer<typeof updateAccessTokenVoSchema>;
export declare const updateAccessTokenRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const updateAccessToken: (id: string, body: UpdateAccessTokenRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    scopes: string[];
    description?: string | undefined;
    spaceIds?: string[] | undefined;
    baseIds?: string[] | undefined;
    hasFullAccess?: boolean | undefined;
}, any>>;
