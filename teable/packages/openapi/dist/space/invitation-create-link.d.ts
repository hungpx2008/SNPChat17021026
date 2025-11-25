import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CREATE_SPACE_INVITATION_LINK = "/space/{spaceId}/invitation/link";
export declare const createSpaceInvitationLinkRoSchema: z.ZodObject<{
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
export type CreateSpaceInvitationLinkRo = z.infer<typeof createSpaceInvitationLinkRoSchema>;
export declare const createSpaceInvitationLinkVoSchema: z.ZodObject<{
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
export type CreateSpaceInvitationLinkVo = z.infer<typeof createSpaceInvitationLinkVoSchema>;
export declare const CreateSpaceInvitationLinkRoute: RouteConfig;
export declare const createSpaceInvitationLink: (params: {
    spaceId: string;
    createSpaceInvitationLinkRo: CreateSpaceInvitationLinkRo;
}) => Promise<import("axios").AxiosResponse<{
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    invitationId: string;
    inviteUrl: string;
    invitationCode: string;
    createdBy: string;
    createdTime: string;
}, any>>;
