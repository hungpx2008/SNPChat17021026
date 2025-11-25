import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const ACCEPT_INVITATION_LINK = "/invitation/link/accept";
export declare const acceptInvitationLinkRoSchema: z.ZodObject<{
    invitationCode: z.ZodString;
    invitationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    invitationId: string;
    invitationCode: string;
}, {
    invitationId: string;
    invitationCode: string;
}>;
export type AcceptInvitationLinkRo = z.infer<typeof acceptInvitationLinkRoSchema>;
export declare const acceptInvitationLinkVoSchema: z.ZodObject<{
    spaceId: z.ZodNullable<z.ZodString>;
    baseId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    spaceId: string | null;
    baseId: string | null;
}, {
    spaceId: string | null;
    baseId: string | null;
}>;
export type AcceptInvitationLinkVo = z.infer<typeof acceptInvitationLinkVoSchema>;
export declare const AcceptInvitationLinkRoute: RouteConfig;
export declare const acceptInvitationLink: (acceptInvitationLinkRo: AcceptInvitationLinkRo) => Promise<import("axios").AxiosResponse<{
    spaceId: string | null;
    baseId: string | null;
}, any>>;
