import { z } from '../zod';
export declare enum CollaboratorType {
    Space = "space",
    Base = "base"
}
export declare enum PrincipalType {
    User = "user",
    Department = "department"
}
export declare const userCollaboratorItem: z.ZodObject<{
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
    resourceType: z.ZodNativeEnum<typeof CollaboratorType>;
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
    resourceType: CollaboratorType;
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
    resourceType: CollaboratorType;
    base?: {
        name: string;
        id: string;
    } | undefined;
    isSystem?: boolean | undefined;
    billable?: boolean | undefined;
}>;
export type UserCollaboratorItem = z.infer<typeof userCollaboratorItem>;
export declare const departmentCollaboratorItem: z.ZodObject<{
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
    resourceType: z.ZodNativeEnum<typeof CollaboratorType>;
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
    resourceType: CollaboratorType;
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
    resourceType: CollaboratorType;
    departmentId: string;
    departmentName: string;
    base?: {
        name: string;
        id: string;
    } | undefined;
}>;
export type DepartmentCollaboratorItem = z.infer<typeof departmentCollaboratorItem>;
export declare const collaboratorItem: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
    resourceType: z.ZodNativeEnum<typeof CollaboratorType>;
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
    resourceType: CollaboratorType;
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
    resourceType: CollaboratorType;
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
    resourceType: z.ZodNativeEnum<typeof CollaboratorType>;
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
    resourceType: CollaboratorType;
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
    resourceType: CollaboratorType;
    departmentId: string;
    departmentName: string;
    base?: {
        name: string;
        id: string;
    } | undefined;
}>]>;
export type CollaboratorItem = z.infer<typeof collaboratorItem>;
