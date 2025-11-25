import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DELETE_BASE_COLLABORATOR = "/base/{baseId}/collaborators";
export declare const deleteBaseCollaboratorRoSchema: z.ZodObject<{
    principalId: z.ZodString;
    principalType: z.ZodNativeEnum<typeof import("../space").PrincipalType>;
}, "strip", z.ZodTypeAny, {
    principalId: string;
    principalType: import("../space").PrincipalType;
}, {
    principalId: string;
    principalType: import("../space").PrincipalType;
}>;
export type DeleteBaseCollaboratorRo = z.infer<typeof deleteBaseCollaboratorRoSchema>;
export declare const DeleteBaseCollaboratorRoute: RouteConfig;
export declare const deleteBaseCollaborator: (params: {
    baseId: string;
    deleteBaseCollaboratorRo: DeleteBaseCollaboratorRo;
}) => Promise<import("axios").AxiosResponse<any, any>>;
