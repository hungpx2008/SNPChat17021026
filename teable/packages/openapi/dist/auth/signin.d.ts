import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SIGN_IN = "/auth/signin";
export declare const signinSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    turnstileToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    turnstileToken?: string | undefined;
}, {
    password: string;
    email: string;
    turnstileToken?: string | undefined;
}>;
export type ISignin = z.infer<typeof signinSchema>;
export declare const SigninRoute: RouteConfig;
export declare const signin: (body: ISignin) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    email: string;
    notifyMeta: {
        email?: boolean | undefined;
    };
    hasPassword: boolean;
    organization?: {
        name: string;
        id: string;
        departments: {
            name: string;
            id: string;
        }[];
        isAdmin?: boolean | undefined;
    } | undefined;
    avatar?: string | null | undefined;
    phone?: string | null | undefined;
    isAdmin?: boolean | null | undefined;
}, any>>;
