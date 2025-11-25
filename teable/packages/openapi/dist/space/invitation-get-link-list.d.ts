import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const LIST_SPACE_INVITATION_LINK = "/space/{spaceId}/invitation/link";
export declare const itemSpaceInvitationLinkVoSchema: z.ZodObject<{
    invitationId: z.ZodString;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
    inviteUrl: z.ZodString;
    invitationCode: z.ZodString;
    createdBy: z.ZodString;
    createdTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}>;
export type ItemSpaceInvitationLinkVo = z.infer<typeof itemSpaceInvitationLinkVoSchema>;
export declare const listSpaceInvitationLinkVoSchema: z.ZodArray<z.ZodObject<{
    invitationId: z.ZodString;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
    inviteUrl: z.ZodString;
    invitationCode: z.ZodString;
    createdBy: z.ZodString;
    createdTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}>, "many">;
export type ListSpaceInvitationLinkVo = z.infer<typeof listSpaceInvitationLinkVoSchema>;
export declare const ListSpaceInvitationLinkRoute: RouteConfig;
export declare const listSpaceInvitationLink: (spaceId: string) => Promise<import("axios").AxiosResponse<{
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}[], any>>;
