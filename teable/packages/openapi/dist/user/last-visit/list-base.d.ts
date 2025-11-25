import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
import { LastVisitResourceType } from './get';
export declare const GET_USER_LAST_VISIT_LIST_BASE = "/user/last-visit/list-base";
export declare const userLastVisitItemBaseVoSchema: z.ZodObject<{
    resourceType: z.ZodNativeEnum<typeof LastVisitResourceType>;
    resourceId: z.ZodString;
    resource: z.ZodObject<Omit<{
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
        collaboratorType: z.ZodOptional<z.ZodNativeEnum<typeof import("../..").CollaboratorType>>;
        restrictedAuthority: z.ZodOptional<z.ZodBoolean>;
    }, "collaboratorType">, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        spaceId: string;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        icon: string | null;
        restrictedAuthority?: boolean | undefined;
    }, {
        name: string;
        id: string;
        spaceId: string;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        icon: string | null;
        restrictedAuthority?: boolean | undefined;
    }>;
    lastVisitTime: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    resourceType: LastVisitResourceType;
    resourceId: string;
    resource: {
        name: string;
        id: string;
        spaceId: string;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        icon: string | null;
        restrictedAuthority?: boolean | undefined;
    };
    lastVisitTime?: string | undefined;
}, {
    resourceType: LastVisitResourceType;
    resourceId: string;
    resource: {
        name: string;
        id: string;
        spaceId: string;
        role: "owner" | "creator" | "editor" | "commenter" | "viewer";
        icon: string | null;
        restrictedAuthority?: boolean | undefined;
    };
    lastVisitTime?: string | undefined;
}>;
export declare const userLastVisitListBaseVoSchema: z.ZodObject<{
    total: z.ZodNumber;
    list: z.ZodArray<z.ZodType<{
        resourceType: LastVisitResourceType;
        resourceId: string;
        resource: {
            name: string;
            id: string;
            spaceId: string;
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
            icon: string | null;
            restrictedAuthority?: boolean | undefined;
        };
        lastVisitTime?: string | undefined;
    }, z.ZodTypeDef, {
        resourceType: LastVisitResourceType;
        resourceId: string;
        resource: {
            name: string;
            id: string;
            spaceId: string;
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
            icon: string | null;
            restrictedAuthority?: boolean | undefined;
        };
        lastVisitTime?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    total: number;
    list: {
        resourceType: LastVisitResourceType;
        resourceId: string;
        resource: {
            name: string;
            id: string;
            spaceId: string;
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
            icon: string | null;
            restrictedAuthority?: boolean | undefined;
        };
        lastVisitTime?: string | undefined;
    }[];
}, {
    total: number;
    list: {
        resourceType: LastVisitResourceType;
        resourceId: string;
        resource: {
            name: string;
            id: string;
            spaceId: string;
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
            icon: string | null;
            restrictedAuthority?: boolean | undefined;
        };
        lastVisitTime?: string | undefined;
    }[];
}>;
export type IUserLastVisitItemBaseVo = z.infer<typeof userLastVisitItemBaseVoSchema>;
export type IUserLastVisitListBaseVo = z.infer<typeof userLastVisitListBaseVoSchema>;
export declare const GetUserLastVisitListBaseRoute: RouteConfig;
export declare const getUserLastVisitListBase: () => Promise<import("axios").AxiosResponse<{
    total: number;
    list: {
        resourceType: LastVisitResourceType;
        resourceId: string;
        resource: {
            name: string;
            id: string;
            spaceId: string;
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
            icon: string | null;
            restrictedAuthority?: boolean | undefined;
        };
        lastVisitTime?: string | undefined;
    }[];
}, any>>;
