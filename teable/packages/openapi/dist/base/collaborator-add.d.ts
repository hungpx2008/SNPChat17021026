import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const ADD_BASE_COLLABORATOR = "/base/{baseId}/collaborator";
export declare const addBaseCollaboratorRoSchema: z.ZodObject<{
    collaborators: z.ZodArray<z.ZodObject<{
        principalId: z.ZodString;
        principalType: z.ZodNativeEnum<typeof import("..").PrincipalType>;
    }, "strip", z.ZodTypeAny, {
        principalId: string;
        principalType: import("..").PrincipalType;
    }, {
        principalId: string;
        principalType: import("..").PrincipalType;
    }>, "many">;
    role: z.ZodNativeEnum<{
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "creator" | "editor" | "commenter" | "viewer";
    collaborators: {
        principalId: string;
        principalType: import("..").PrincipalType;
    }[];
}, {
    role: "creator" | "editor" | "commenter" | "viewer";
    collaborators: {
        principalId: string;
        principalType: import("..").PrincipalType;
    }[];
}>;
export type AddBaseCollaboratorRo = z.infer<typeof addBaseCollaboratorRoSchema>;
export declare const AddBaseCollaboratorRoute: RouteConfig;
export declare const addBaseCollaborator: (baseId: string, collaborator: AddBaseCollaboratorRo) => Promise<import("axios").AxiosResponse<any, any>>;
