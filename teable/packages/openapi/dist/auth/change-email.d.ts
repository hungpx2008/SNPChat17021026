import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const CHANGE_EMAIL = "/auth/change-email";
export declare const changeEmailRoSchema: z.ZodObject<{
    email: z.ZodString;
    token: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    code: string;
    email: string;
}, {
    token: string;
    code: string;
    email: string;
}>;
export type IChangeEmailRo = z.infer<typeof changeEmailRoSchema>;
export declare const changeEmailRoute: RouteConfig;
export declare const changeEmail: (ro: IChangeEmailRo) => Promise<import("axios").AxiosResponse<void, any>>;
