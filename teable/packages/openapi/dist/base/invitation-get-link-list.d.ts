import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const LIST_BASE_INVITATION_LINK = "/base/{baseId}/invitation/link";
export declare const itemBaseInvitationLinkVoSchema: z.ZodObject<Omit<{
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
}, "role"> & {
    role: z.ZodNativeEnum<{
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}, {
    role: "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}>;
export type ItemBaseInvitationLinkVo = z.infer<typeof itemBaseInvitationLinkVoSchema>;
export declare const listBaseInvitationLinkVoSchema: z.ZodArray<z.ZodObject<Omit<{
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
}, "role"> & {
    role: z.ZodNativeEnum<{
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}, {
    role: "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}>, "many">;
export type ListBaseInvitationLinkVo = z.infer<typeof listBaseInvitationLinkVoSchema>;
export declare const ListBaseInvitationLinkRoute: RouteConfig;
export declare const listBaseInvitationLink: (baseId: string) => Promise<import("axios").AxiosResponse<{
    role: "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}[], any>>;
