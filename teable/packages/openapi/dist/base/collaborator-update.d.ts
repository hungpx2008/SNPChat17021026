import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { PrincipalType } from '../space/types';
import { z } from '../zod';
export declare const UPDATE_BASE_COLLABORATE = "/base/{baseId}/collaborators";
export declare const updateBaseCollaborateRoSchema: z.ZodObject<{
    principalId: z.ZodString;
    principalType: z.ZodNativeEnum<typeof PrincipalType>;
    role: z.ZodNativeEnum<{
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "creator" | "editor" | "commenter" | "viewer";
    principalId: string;
    principalType: PrincipalType;
}, {
    role: "creator" | "editor" | "commenter" | "viewer";
    principalId: string;
    principalType: PrincipalType;
}>;
export type UpdateBaseCollaborateRo = z.infer<typeof updateBaseCollaborateRoSchema>;
export declare const UpdateBaseCollaborateRoute: RouteConfig;
export declare const updateBaseCollaborator: (params: {
    baseId: string;
    updateBaseCollaborateRo: UpdateBaseCollaborateRo;
}) => Promise<import("axios").AxiosResponse<void, any>>;
