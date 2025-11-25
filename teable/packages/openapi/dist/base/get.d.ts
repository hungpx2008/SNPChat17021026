import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { CollaboratorType } from '../space/types';
import { z } from '../zod';
export declare const GET_BASE = "/base/{baseId}";
export declare const getBaseItemSchema: z.ZodObject<{
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
    collaboratorType: z.ZodOptional<z.ZodNativeEnum<typeof CollaboratorType>>;
    restrictedAuthority: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
}, {
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
}>;
export declare const getBaseVoSchema: z.ZodObject<{
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
    collaboratorType: z.ZodOptional<z.ZodNativeEnum<typeof CollaboratorType>>;
    restrictedAuthority: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
}, {
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
}>;
export type IGetBaseVo = z.infer<typeof getBaseVoSchema>;
export declare const GetBaseRoute: RouteConfig;
export declare const getBaseById: (baseId: string) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    spaceId: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    icon: string | null;
    collaboratorType?: CollaboratorType | undefined;
    restrictedAuthority?: boolean | undefined;
}, any>>;
