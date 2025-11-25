import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_SHARED_BASE = "/base/shared-base";
export declare const getSharedBaseItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    spaceId: z.ZodString;
    icon: z.ZodNullable<z.ZodString>;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
    collaboratorType: z.ZodOptional<z.ZodNativeEnum<typeof import("..").CollaboratorType>>;
    restrictedAuthority: z.ZodOptional<z.ZodBoolean>;
} & {
    spaceName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: import("..").CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
    spaceName?: string | undefined;
}, {
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: import("..").CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
    spaceName?: string | undefined;
}>;
export declare const getSharedBaseVoSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    spaceId: z.ZodString;
    icon: z.ZodNullable<z.ZodString>;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
    collaboratorType: z.ZodOptional<z.ZodNativeEnum<typeof import("..").CollaboratorType>>;
    restrictedAuthority: z.ZodOptional<z.ZodBoolean>;
} & {
    spaceName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: import("..").CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
    spaceName?: string | undefined;
}, {
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: import("..").CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
    spaceName?: string | undefined;
}>, "many">;
export type IGetSharedBaseVo = z.infer<typeof getSharedBaseVoSchema>;
export declare const GetSharedBaseRoute: RouteConfig;
export declare const getSharedBase: () => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: import("..").CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
    spaceName?: string | undefined;
}[], any>>;
