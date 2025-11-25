import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
import { PrincipalType } from './types';
export declare const DELETE_SPACE_COLLABORATOR = "/space/{spaceId}/collaborators";
export declare const deleteSpaceCollaboratorRoSchema: z.ZodObject<{
    principalId: z.ZodString;
    principalType: z.ZodNativeEnum<typeof PrincipalType>;
}, "strip", z.ZodTypeAny, {
    principalId: string;
    principalType: PrincipalType;
}, {
    principalId: string;
    principalType: PrincipalType;
}>;
export type DeleteSpaceCollaboratorRo = z.infer<typeof deleteSpaceCollaboratorRoSchema>;
export declare const DeleteSpaceCollaboratorRoute: RouteConfig;
export declare const deleteSpaceCollaborator: (params: {
    spaceId: string;
    deleteSpaceCollaboratorRo: DeleteSpaceCollaboratorRo;
}) => Promise<import("axios").AxiosResponse<any, any>>;
