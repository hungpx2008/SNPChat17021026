import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const UPDATE_BASE_INVITATION_LINK = "/base/{baseId}/invitation/link/{invitationId}";
export declare const updateBaseInvitationLinkRoSchema: z.ZodObject<{
    role: z.ZodNativeEnum<{
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "creator" | "editor" | "commenter" | "viewer";
}, {
    role: "creator" | "editor" | "commenter" | "viewer";
}>;
export type UpdateBaseInvitationLinkRo = z.infer<typeof updateBaseInvitationLinkRoSchema>;
export declare const updateBaseInvitationLinkVoSchema: z.ZodObject<{
    invitationId: z.ZodString;
    role: z.ZodNativeEnum<{
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
}, {
    role: "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
}>;
export type UpdateBaseInvitationLinkVo = z.infer<typeof updateBaseInvitationLinkVoSchema>;
export declare const UpdateBaseInvitationLinkRoute: RouteConfig;
export declare const updateBaseInvitationLink: (params: {
    baseId: string;
    invitationId: string;
    updateBaseInvitationLinkRo: UpdateBaseInvitationLinkRo;
}) => Promise<import("axios").AxiosResponse<{
    role: "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
}, any>>;
