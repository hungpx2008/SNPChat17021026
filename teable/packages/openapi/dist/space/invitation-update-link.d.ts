import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const UPDATE_SPACE_INVITATION_LINK = "/space/{spaceId}/invitation/link/{invitationId}";
export declare const updateSpaceInvitationLinkRoSchema: z.ZodObject<{
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
}, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
}>;
export type UpdateSpaceInvitationLinkRo = z.infer<typeof updateSpaceInvitationLinkRoSchema>;
export declare const updateSpaceInvitationLinkVoSchema: z.ZodObject<{
    invitationId: z.ZodString;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
}, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
}>;
export type UpdateSpaceInvitationLinkVo = z.infer<typeof updateSpaceInvitationLinkVoSchema>;
export declare const UpdateSpaceInvitationLinkRoute: RouteConfig;
export declare const updateSpaceInvitationLink: (params: {
    spaceId: string;
    invitationId: string;
    updateSpaceInvitationLinkRo: UpdateSpaceInvitationLinkRo;
}) => Promise<import("axios").AxiosResponse<{
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
}, any>>;
