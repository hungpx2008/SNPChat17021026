import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const WAITLIST_INVITE_CODE = "/auth/waitlist-invite-code";
export declare const waitlistInviteCodeRoSchema: z.ZodObject<{
    count: z.ZodNumber;
    times: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    count: number;
    times: number;
}, {
    count: number;
    times: number;
}>;
export type IWaitlistInviteCodeRo = z.infer<typeof waitlistInviteCodeRoSchema>;
export declare const waitlistInviteCodeSchemaVo: z.ZodArray<z.ZodObject<{
    code: z.ZodString;
    times: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    code: string;
    times: number;
}, {
    code: string;
    times: number;
}>, "many">;
export type IWaitlistInviteCodeVo = z.infer<typeof waitlistInviteCodeSchemaVo>;
export declare const WaitlistInviteCodeRoute: RouteConfig;
export declare const genWaitlistInviteCode: (body: IWaitlistInviteCodeRo) => Promise<import("axios").AxiosResponse<{
    code: string;
    times: number;
}[], any>>;
