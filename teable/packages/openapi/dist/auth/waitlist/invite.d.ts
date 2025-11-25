import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const INVITE_WAITLIST = "/auth/invite-waitlist";
export declare const inviteWaitlistRoSchema: z.ZodObject<{
    list: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    list: string[];
}, {
    list: string[];
}>;
export type IInviteWaitlistRo = z.infer<typeof inviteWaitlistRoSchema>;
export declare const inviteWaitlistSchemaVo: z.ZodArray<z.ZodObject<{
    email: z.ZodString;
    code: z.ZodString;
    times: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    code: string;
    email: string;
    times: number;
}, {
    code: string;
    email: string;
    times: number;
}>, "many">;
export type IInviteWaitlistVo = z.infer<typeof inviteWaitlistSchemaVo>;
export declare const InviteWaitlistRoute: RouteConfig;
export declare const inviteWaitlist: (body: IInviteWaitlistRo) => Promise<import("axios").AxiosResponse<{
    code: string;
    email: string;
    times: number;
}[], any>>;
