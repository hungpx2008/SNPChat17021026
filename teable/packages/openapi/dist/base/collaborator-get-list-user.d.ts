import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const BASE_COLLABORATE_LIST_USER = "/base/{baseId}/collaborators/users";
export declare const listBaseCollaboratorUserRoSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    skip: z.ZodOptional<z.ZodNumber>;
    take: z.ZodOptional<z.ZodNumber>;
    includeSystem: z.ZodOptional<z.ZodBoolean>;
    orderBy: z.ZodOptional<z.ZodEnum<["desc", "asc"]>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    orderBy?: "desc" | "asc" | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    includeSystem?: boolean | undefined;
}, {
    search?: string | undefined;
    orderBy?: "desc" | "asc" | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    includeSystem?: boolean | undefined;
}>;
export type IListBaseCollaboratorUserRo = z.infer<typeof listBaseCollaboratorUserRoSchema>;
export declare const itemBaseCollaboratorUserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    email: string;
    avatar?: string | null | undefined;
}, {
    name: string;
    id: string;
    email: string;
    avatar?: string | null | undefined;
}>;
export type IItemBaseCollaboratorUser = z.infer<typeof itemBaseCollaboratorUserSchema>;
export declare const listBaseCollaboratorUserVoSchema: z.ZodObject<{
    users: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        email: string;
        avatar?: string | null | undefined;
    }, {
        name: string;
        id: string;
        email: string;
        avatar?: string | null | undefined;
    }>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    users: {
        name: string;
        id: string;
        email: string;
        avatar?: string | null | undefined;
    }[];
}, {
    total: number;
    users: {
        name: string;
        id: string;
        email: string;
        avatar?: string | null | undefined;
    }[];
}>;
export type IListBaseCollaboratorUserVo = z.infer<typeof listBaseCollaboratorUserVoSchema>;
export declare const ListBaseCollaboratorUserRoute: RouteConfig;
export declare const getUserCollaborators: (baseId: string, options?: IListBaseCollaboratorUserRo) => Promise<import("axios").AxiosResponse<{
    total: number;
    users: {
        name: string;
        id: string;
        email: string;
        avatar?: string | null | undefined;
    }[];
}, any>>;
