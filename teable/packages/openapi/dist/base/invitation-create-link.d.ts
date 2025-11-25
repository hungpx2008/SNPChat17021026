import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CREATE_BASE_INVITATION_LINK = "/base/{baseId}/invitation/link";
export declare const createBaseInvitationLinkRoSchema: z.ZodObject<{
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
export type CreateBaseInvitationLinkRo = z.infer<typeof createBaseInvitationLinkRoSchema>;
export declare const createBaseInvitationLinkVoSchema: z.ZodObject<Omit<{
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
export type CreateBaseInvitationLinkVo = z.infer<typeof createBaseInvitationLinkVoSchema>;
export declare const CreateBaseInvitationLinkRoute: RouteConfig;
export declare const createBaseInvitationLink: (params: {
    baseId: string;
    createBaseInvitationLinkRo: CreateBaseInvitationLinkRo;
}) => Promise<import("axios").AxiosResponse<{
    role: "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}, any>>;
