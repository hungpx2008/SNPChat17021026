import { z } from '../zod';
export declare const SEND_RESET_PASSWORD_EMAIL = "/auth/send-reset-password-email";
export declare const sendResetPasswordEmailRoSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type ISendResetPasswordEmailRo = z.infer<typeof sendResetPasswordEmailRoSchema>;
export declare const sendResetPasswordEmailRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const sendResetPasswordEmail: (ro: ISendResetPasswordEmailRo) => Promise<import("axios").AxiosResponse<void, any>>;
