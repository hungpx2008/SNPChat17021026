import { z } from '../zod';
export declare const RESET_PASSWORD = "/auth/reset-password";
export declare const resetPasswordRoSchema: z.ZodObject<{
    password: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    code: string;
}, {
    password: string;
    code: string;
}>;
export type IResetPasswordRo = z.infer<typeof resetPasswordRoSchema>;
export declare const resetPasswordRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const resetPassword: (ro: IResetPasswordRo) => Promise<import("axios").AxiosResponse<void, any>>;
