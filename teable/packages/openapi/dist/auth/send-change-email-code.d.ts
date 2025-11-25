import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SEND_CHANGE_EMAIL_CODE = "/auth/send-change-email-code";
export declare const sendChangeEmailCodeRoSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export type ISendChangeEmailCodeRo = z.infer<typeof sendChangeEmailCodeRoSchema>;
export declare const sendChangeEmailCodeVoSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export type ISendChangeEmailCodeVo = z.infer<typeof sendChangeEmailCodeVoSchema>;
export declare const SendChangeEmailCodeRoute: RouteConfig;
export declare const sendChangeEmailCode: (ro: ISendChangeEmailCodeRo) => Promise<import("axios").AxiosResponse<{
    token: string;
}, any>>;
