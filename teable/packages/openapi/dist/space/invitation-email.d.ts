import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const EMAIL_SPACE_INVITATION = "/space/{spaceId}/invitation/email";
export declare const emailSpaceInvitationRoSchema: z.ZodObject<{
    emails: z.ZodArray<z.ZodString, "many">;
    role: z.ZodNativeEnum<{
        readonly Owner: "owner";
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    emails: string[];
}, {
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    emails: string[];
}>;
export type EmailSpaceInvitationRo = z.infer<typeof emailSpaceInvitationRoSchema>;
export declare const emailSpaceInvitationVoSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    invitationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    invitationId: string;
}, {
    invitationId: string;
}>>;
export type EmailInvitationVo = z.infer<typeof emailSpaceInvitationVoSchema>;
export declare const EmailInvitationRoute: RouteConfig;
export declare const emailSpaceInvitation: (params: {
    spaceId: string;
    emailSpaceInvitationRo: EmailSpaceInvitationRo;
}) => Promise<import("axios").AxiosResponse<Record<string, {
    invitationId: string;
}>, any>>;
