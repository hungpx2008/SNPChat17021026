import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../../zod';
export declare const JOIN_WAITLIST = "/auth/join-waitlist";
export declare const joinWaitlistSchemaRo: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type IJoinWaitlistRo = z.infer<typeof joinWaitlistSchemaRo>;
export declare const joinWaitlistSchemaVo: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type IJoinWaitlistVo = z.infer<typeof joinWaitlistSchemaVo>;
export declare const JoinWaitlistRoute: RouteConfig;
export declare const joinWaitlist: (body: IJoinWaitlistRo) => Promise<import("axios").AxiosResponse<{
    email: string;
}, any>>;
