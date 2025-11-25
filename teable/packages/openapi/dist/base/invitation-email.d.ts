import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const EMAIL_BASE_INVITATION = "/base/{baseId}/invitation/email";
export declare const emailBaseInvitationRoSchema: z.ZodObject<{
    emails: z.ZodArray<z.ZodString, "many">;
    role: z.ZodNativeEnum<{
        readonly Creator: "creator";
        readonly Editor: "editor";
        readonly Commenter: "commenter";
        readonly Viewer: "viewer";
    }>;
}, "strip", z.ZodTypeAny, {
    role: "creator" | "editor" | "commenter" | "viewer";
    emails: string[];
}, {
    role: "creator" | "editor" | "commenter" | "viewer";
    emails: string[];
}>;
export type EmailBaseInvitationRo = z.infer<typeof emailBaseInvitationRoSchema>;
export declare const emailBaseInvitationVoSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    invitationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    invitationId: string;
}, {
    invitationId: string;
}>>;
export declare const EmailBaseInvitationRoute: RouteConfig;
export declare const emailBaseInvitation: (params: {
    baseId: string;
    emailBaseInvitationRo: EmailBaseInvitationRo;
}) => Promise<import("axios").AxiosResponse<Record<string, {
    invitationId: string;
}>, any>>;
