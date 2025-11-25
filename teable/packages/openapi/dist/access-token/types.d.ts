import { z } from '../zod';
export declare const accessTokenItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    scopes: z.ZodArray<z.ZodString, "many">;
    spaceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    baseIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    hasFullAccess: z.ZodOptional<z.ZodBoolean>;
    expiredTime: z.ZodString;
    createdTime: z.ZodString;
    lastUsedTime: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    createdTime: string;
    scopes: string[];
    expiredTime: string;
    description?: string | undefined;
    spaceIds?: string[] | undefined;
    baseIds?: string[] | undefined;
    hasFullAccess?: boolean | undefined;
    lastUsedTime?: string | undefined;
}, {
    name: string;
    id: string;
    createdTime: string;
    scopes: string[];
    expiredTime: string;
    description?: string | undefined;
    spaceIds?: string[] | undefined;
    baseIds?: string[] | undefined;
    hasFullAccess?: boolean | undefined;
    lastUsedTime?: string | undefined;
}>;
export type AccessTokenItem = z.infer<typeof accessTokenItemSchema>;
