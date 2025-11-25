import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SIGN_UP = "/auth/signup";
export declare const refMetaSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    referer: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    query?: string | undefined;
    referer?: string | undefined;
}, {
    query?: string | undefined;
    referer?: string | undefined;
}>;
export type IRefMeta = z.infer<typeof refMetaSchema>;
export declare const signupSchema: z.ZodObject<{
    email: z.ZodString;
} & {
    defaultSpaceName: z.ZodOptional<z.ZodString>;
    refMeta: z.ZodOptional<z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        referer: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        query?: string | undefined;
        referer?: string | undefined;
    }, {
        query?: string | undefined;
        referer?: string | undefined;
    }>>;
    password: z.ZodString;
    verification: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        token: string;
        code: string;
    }, {
        token: string;
        code: string;
    }>>;
    inviteCode: z.ZodOptional<z.ZodString>;
    turnstileToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    turnstileToken?: string | undefined;
    defaultSpaceName?: string | undefined;
    refMeta?: {
        query?: string | undefined;
        referer?: string | undefined;
    } | undefined;
    verification?: {
        token: string;
        code: string;
    } | undefined;
    inviteCode?: string | undefined;
}, {
    password: string;
    email: string;
    turnstileToken?: string | undefined;
    defaultSpaceName?: string | undefined;
    refMeta?: {
        query?: string | undefined;
        referer?: string | undefined;
    } | undefined;
    verification?: {
        token: string;
        code: string;
    } | undefined;
    inviteCode?: string | undefined;
}>;
export type ISignup = z.infer<typeof signupSchema>;
export declare const SignupRoute: RouteConfig;
export declare const signup: (body: ISignup) => Promise<import("axios").AxiosResponse<{
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
