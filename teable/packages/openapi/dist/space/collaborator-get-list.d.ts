import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import type { CollaboratorItem, DepartmentCollaboratorItem, UserCollaboratorItem } from './types';
import { collaboratorItem, PrincipalType } from './types';
export declare const SPACE_COLLABORATE_LIST = "/space/{spaceId}/collaborators";
export declare const listSpaceCollaboratorRoSchema: z.ZodObject<{
    includeSystem: z.ZodOptional<z.ZodBoolean>;
    includeBase: z.ZodOptional<z.ZodBoolean>;
    skip: z.ZodOptional<z.ZodNumber>;
    take: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof PrincipalType>>;
    orderBy: z.ZodOptional<z.ZodEnum<["desc", "asc"]>>;
}, "strip", z.ZodTypeAny, {
    type?: PrincipalType | undefined;
    search?: string | undefined;
    orderBy?: "desc" | "asc" | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    includeSystem?: boolean | undefined;
    includeBase?: boolean | undefined;
}, {
    type?: PrincipalType | undefined;
    search?: string | undefined;
    orderBy?: "desc" | "asc" | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    includeSystem?: boolean | undefined;
    includeBase?: boolean | undefined;
}>;
export type ListSpaceCollaboratorRo = z.infer<typeof listSpaceCollaboratorRoSchema>;
export type ItemSpaceCollaboratorVo = z.infer<typeof collaboratorItem>;
export declare const listSpaceCollaboratorVoSchema: z.ZodObject<{
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
        resourceType: z.ZodNativeEnum<typeof import("./types").CollaboratorType>;
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
        resourceType: import("./types").CollaboratorType;
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
        resourceType: import("./types").CollaboratorType;
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
        resourceType: z.ZodNativeEnum<typeof import("./types").CollaboratorType>;
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
        resourceType: import("./types").CollaboratorType;
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
        resourceType: import("./types").CollaboratorType;
        departmentId: string;
        departmentName: string;
        base?: {
            name: string;
            id: string;
        } | undefined;
    }>]>, "many">;
    uniqTotal: z.ZodNumber;
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
        resourceType: import("./types").CollaboratorType;
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
        resourceType: import("./types").CollaboratorType;
        departmentId: string;
        departmentName: string;
        base?: {
            name: string;
            id: string;
        } | undefined;
    })[];
    uniqTotal: number;
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
        resourceType: import("./types").CollaboratorType;
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
        resourceType: import("./types").CollaboratorType;
        departmentId: string;
        departmentName: string;
        base?: {
            name: string;
            id: string;
        } | undefined;
    })[];
    uniqTotal: number;
    total: number;
}>;
export type ListSpaceCollaboratorVo = z.infer<typeof listSpaceCollaboratorVoSchema>;
type GetFilteredCollaborator<T extends {
    type?: PrincipalType;
}> = T extends {
    type: PrincipalType.User;
} ? Extract<UserCollaboratorItem, {
    type: PrincipalType.User;
}> : T extends {
    type: PrincipalType.Department;
} ? Extract<DepartmentCollaboratorItem, {
    type: PrincipalType.Department;
}> : CollaboratorItem;
export type IGetCollaboratorsResponse<T extends {
    type?: PrincipalType;
} = object> = Omit<ListSpaceCollaboratorVo, 'collaborators'> & {
    collaborators: GetFilteredCollaborator<T>[];
    total: number;
};
export declare const ListSpaceCollaboratorRoute: RouteConfig;
export declare const getSpaceCollaboratorList: <T extends {
    type?: PrincipalType | undefined;
    search?: string | undefined;
    orderBy?: "desc" | "asc" | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    includeSystem?: boolean | undefined;
    includeBase?: boolean | undefined;
}>(spaceId: string, query?: ListSpaceCollaboratorRo) => Promise<import("axios").AxiosResponse<IGetCollaboratorsResponse<T>, any>>;
export {};
