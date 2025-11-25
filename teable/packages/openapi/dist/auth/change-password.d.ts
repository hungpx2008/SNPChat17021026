import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CHANGE_PASSWORD = "/auth/change-password";
export declare const changePasswordRoSchema: z.ZodObject<{
    password: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    newPassword: string;
}, {
    password: string;
    newPassword: string;
}>;
export type IChangePasswordRo = z.infer<typeof changePasswordRoSchema>;
export declare const ChangePasswordRoute: RouteConfig;
export declare const changePassword: (body: IChangePasswordRo) => Promise<import("axios").AxiosResponse<void, any>>;
