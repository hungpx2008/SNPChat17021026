import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const USER_INFO = "/auth/user";
export declare const userInfoVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    email?: string | undefined;
    avatar?: string | null | undefined;
}, {
    name: string;
    id: string;
    email?: string | undefined;
    avatar?: string | null | undefined;
}>;
export type IUserInfoVo = z.infer<typeof userInfoVoSchema>;
export declare const userInfoRoute: RouteConfig;
export declare const userInfo: () => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    email?: string | undefined;
    avatar?: string | null | undefined;
}, any>>;
