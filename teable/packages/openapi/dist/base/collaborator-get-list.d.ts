import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IGetCollaboratorsResponse } from '../space';
import { PrincipalType } from '../space/types';
import { z } from '../zod';
export declare const BASE_COLLABORATE_LIST = "/base/{baseId}/collaborators";
export declare const itemBaseCollaboratorSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    userId: z.ZodString;
    userName: z.ZodString;
    email: z.ZodString;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
    avatar: z.ZodNullable<z.ZodString>;
    createdTime: z.ZodString;
    type: z.ZodLiteral<PrincipalType.User>;
    resourceType: z.ZodNativeEnum<typeof import("../space").CollaboratorType>;
    isSystem: z.ZodOptional<z.ZodBoolean>;
    billable: z.ZodOptional<z.ZodBoolean>;
    base: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: PrincipalType.User;
    email: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    createdTime: string;
    userId: string;
    userName: string;
    avatar: string | null;
    resourceType: import("../space").CollaboratorType;
    base?: {
        name: string;
        id: string;
    } | undefined;
    isSystem?: boolean | undefined;
    billable?: boolean | undefined;
}, {
    type: PrincipalType.User;
    email: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    createdTime: string;
    userId: string;
    userName: string;
    avatar: string | null;
    resourceType: import("../space").CollaboratorType;
    base?: {
        name: string;
        id: string;
    } | undefined;
    isSystem?: boolean | undefined;
    billable?: boolean | undefined;
}>, z.ZodObject<{
    departmentId: z.ZodString;
    departmentName: z.ZodString;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
    createdTime: z.ZodString;
    type: z.ZodLiteral<PrincipalType.Department>;
    resourceType: z.ZodNativeEnum<typeof import("../space").CollaboratorType>;
    base: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: PrincipalType.Department;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    createdTime: string;
    resourceType: import("../space").CollaboratorType;
    departmentId: string;
    departmentName: string;
    base?: {
        name: string;
        id: string;
    } | undefined;
}, {
    type: PrincipalType.Department;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    createdTime: string;
    resourceType: import("../space").CollaboratorType;
    departmentId: string;
    departmentName: string;
    base?: {
        name: string;
        id: string;
    } | undefined;
}>]>;
export declare const listBaseCollaboratorRoSchema: z.ZodObject<{
    includeSystem: z.ZodOptional<z.ZodBoolean>;
    skip: z.ZodOptional<z.ZodNumber>;
    take: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof PrincipalType>>;
    role: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    type?: PrincipalType | undefined;
    search?: string | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    role?: ("owner" | "creator" | "editor" | "commenter" | "viewer")[] | undefined;
    includeSystem?: boolean | undefined;
}, {
    type?: PrincipalType | undefined;
    search?: string | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    role?: ("owner" | "creator" | "editor" | "commenter" | "viewer")[] | undefined;
    includeSystem?: boolean | undefined;
}>;
export type ListBaseCollaboratorRo = z.infer<typeof listBaseCollaboratorRoSchema>;
export type ItemBaseCollaborator = z.infer<typeof itemBaseCollaboratorSchema>;
export declare const listBaseCollaboratorVoSchema: z.ZodObject<{
    collaborators: z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        userId: z.ZodString;
        userName: z.ZodString;
        email: z.ZodString;
        role: z.ZodNativeEnum<{
            readonly Owner: "owner";
            readonly Creator: "creator";
            readonly Editor: "editor";
            readonly Commenter: "commenter";
            readonly Viewer: "viewer";
        }>;
        avatar: z.ZodNullable<z.ZodString>;
        createdTime: z.ZodString;
        type: z.ZodLiteral<PrincipalType.User>;
        resourceType: z.ZodNativeEnum<typeof import("../space").CollaboratorType>;
        isSystem: z.ZodOptional<z.ZodBoolean>;
        billable: z.ZodOptional<z.ZodBoolean>;
        base: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
        }, {
            name: string;
            id: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: PrincipalType.User;
        email: string;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        createdTime: string;
        userId: string;
        userName: string;
        avatar: string | null;
        resourceType: import("../space").CollaboratorType;
        base?: {
            name: string;
            id: string;
        } | undefined;
        isSystem?: boolean | undefined;
        billable?: boolean | undefined;
    }, {
        type: PrincipalType.User;
        email: string;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        createdTime: string;
        userId: string;
        userName: string;
        avatar: string | null;
        resourceType: import("../space").CollaboratorType;
        base?: {
            name: string;
            id: string;
        } | undefined;
        isSystem?: boolean | undefined;
        billable?: boolean | undefined;
    }>, z.ZodObject<{
        departmentId: z.ZodString;
        departmentName: z.ZodString;
        role: z.ZodNativeEnum<{
            readonly Owner: "owner";
            readonly Creator: "creator";
            readonly Editor: "editor";
            readonly Commenter: "commenter";
            readonly Viewer: "viewer";
        }>;
        createdTime: z.ZodString;
        type: z.ZodLiteral<PrincipalType.Department>;
        resourceType: z.ZodNativeEnum<typeof import("../space").CollaboratorType>;
        base: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
        }, {
            name: string;
            id: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: PrincipalType.Department;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        createdTime: string;
        resourceType: import("../space").CollaboratorType;
        departmentId: string;
        departmentName: string;
        base?: {
            name: string;
            id: string;
        } | undefined;
    }, {
        type: PrincipalType.Department;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        createdTime: string;
        resourceType: import("../space").CollaboratorType;
        departmentId: string;
        departmentName: string;
        base?: {
            name: string;
            id: string;
        } | undefined;
    }>]>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    collaborators: ({
        type: PrincipalType.User;
        email: string;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        createdTime: string;
        userId: string;
        userName: string;
        avatar: string | null;
        resourceType: import("../space").CollaboratorType;
        base?: {
            name: string;
            id: string;
        } | undefined;
        isSystem?: boolean | undefined;
        billable?: boolean | undefined;
    } | {
        type: PrincipalType.Department;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        createdTime: string;
        resourceType: import("../space").CollaboratorType;
        departmentId: string;
        departmentName: string;
        base?: {
            name: string;
            id: string;
        } | undefined;
    })[];
    total: number;
}, {
    collaborators: ({
        type: PrincipalType.User;
        email: string;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        createdTime: string;
        userId: string;
        userName: string;
        avatar: string | null;
        resourceType: import("../space").CollaboratorType;
        base?: {
            name: string;
            id: string;
        } | undefined;
        isSystem?: boolean | undefined;
        billable?: boolean | undefined;
    } | {
        type: PrincipalType.Department;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        createdTime: string;
        resourceType: import("../space").CollaboratorType;
        departmentId: string;
        departmentName: string;
        base?: {
            name: string;
            id: string;
        } | undefined;
    })[];
    total: number;
}>;
export type ListBaseCollaboratorVo = z.infer<typeof listBaseCollaboratorVoSchema>;
export declare const ListBaseCollaboratorRoute: RouteConfig;
export declare const getBaseCollaboratorList: <T extends {
    type?: PrincipalType | undefined;
    search?: string | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    role?: ("owner" | "creator" | "editor" | "commenter" | "viewer")[] | undefined;
    includeSystem?: boolean | undefined;
}>(baseId: string, options?: T) => Promise<import("axios").AxiosResponse<IGetCollaboratorsResponse<T>, any>>;
