import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const GET_WAITLIST = "/auth/waitlist";
export declare const getWaitlistSchemaVo: z.ZodArray<z.ZodObject<{
    email: z.ZodString;
    invite: z.ZodNullable<z.ZodBoolean>;
    inviteTime: z.ZodNullable<z.ZodDate>;
    createdTime: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    email: string;
    createdTime: Date;
    invite: boolean | null;
    inviteTime: Date | null;
}, {
    email: string;
    createdTime: Date;
    invite: boolean | null;
    inviteTime: Date | null;
}>, "many">;
export type IGetWaitlistVo = z.infer<typeof getWaitlistSchemaVo>;
export declare const GetWaitlistRoute: RouteConfig;
export declare const getWaitlist: () => Promise<import("axios").AxiosResponse<{
    email: string;
    createdTime: Date;
    invite: boolean | null;
    inviteTime: Date | null;
}[], any>>;
