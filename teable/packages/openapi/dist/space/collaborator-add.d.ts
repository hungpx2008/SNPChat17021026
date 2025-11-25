import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { PrincipalType } from '../space/types';
import { z } from '../zod';
export declare const ADD_SPACE_COLLABORATOR = "/space/{spaceId}/collaborator";
export declare const addCollaboratorSchema: z.ZodObject<{
    principalId: z.ZodString;
    principalType: z.ZodNativeEnum<typeof PrincipalType>;
}, "strip", z.ZodTypeAny, {
    principalId: string;
    principalType: PrincipalType;
}, {
    principalId: string;
    principalType: PrincipalType;
}>;
export type IAddCollaborator = z.infer<typeof addCollaboratorSchema>;
export declare const addSpaceCollaboratorRoSchema: z.ZodObject<{
    collaborators: z.ZodArray<z.ZodObject<{
        principalId: z.ZodString;
        principalType: z.ZodNativeEnum<typeof PrincipalType>;
    }, "strip", z.ZodTypeAny, {
        principalId: string;
        principalType: PrincipalType;
    }, {
        principalId: string;
        principalType: PrincipalType;
    }>, "many">;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    collaborators: {
        principalId: string;
        principalType: PrincipalType;
    }[];
}, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    collaborators: {
        principalId: string;
        principalType: PrincipalType;
    }[];
}>;
export type AddSpaceCollaboratorRo = z.infer<typeof addSpaceCollaboratorRoSchema>;
export declare const AddSpaceCollaboratorRoute: RouteConfig;
export declare const addSpaceCollaborator: (spaceId: string, collaborator: AddSpaceCollaboratorRo) => Promise<import("axios").AxiosResponse<void, any>>;
