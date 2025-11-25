import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { PrincipalType } from './types';
export declare const UPDATE_SPACE_COLLABORATE = "/space/{spaceId}/collaborators";
export declare const updateSpaceCollaborateRoSchema: z.ZodObject<{
    principalId: z.ZodString;
    principalType: z.ZodNativeEnum<typeof PrincipalType>;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    principalId: string;
    principalType: PrincipalType;
}, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    principalId: string;
    principalType: PrincipalType;
}>;
export type UpdateSpaceCollaborateRo = z.infer<typeof updateSpaceCollaborateRoSchema>;
export declare const UpdateSpaceCollaborateRoute: RouteConfig;
export declare const updateSpaceCollaborator: (params: {
    spaceId: string;
    updateSpaceCollaborateRo: UpdateSpaceCollaborateRo;
}) => Promise<import("axios").AxiosResponse<void, any>>;
