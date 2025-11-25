import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SEND_SIGNUP_VERIFICATION_CODE = "/auth/send-signup-verification-code";
export declare const sendSignupVerificationCodeRoSchema: z.ZodObject<{
    email: z.ZodString;
    turnstileToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    turnstileToken?: string | undefined;
}, {
    email: string;
    turnstileToken?: string | undefined;
}>;
export type ISendSignupVerificationCodeRo = z.infer<typeof sendSignupVerificationCodeRoSchema>;
export declare const sendSignupVerificationCodeVoSchema: z.ZodObject<{
    token: z.ZodString;
    expiresTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    expiresTime: string;
}, {
    token: string;
    expiresTime: string;
}>;
export type ISendSignupVerificationCodeVo = z.infer<typeof sendSignupVerificationCodeVoSchema>;
export declare const sendSignupVerificationCodeRoute: RouteConfig;
export declare const sendSignupVerificationCode: (email: string, turnstileToken?: string) => Promise<import("axios").AxiosResponse<{
    token: string;
    expiresTime: string;
}, any>>;
