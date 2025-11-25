import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const USER_ME = "/auth/user/me";
export declare const userMeVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notifyMeta: z.ZodObject<{
        email: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        email?: boolean | undefined;
    }, {
        email?: boolean | undefined;
    }>;
    hasPassword: z.ZodBoolean;
    isAdmin: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    organization: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        departments: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
        }, {
            name: string;
            id: string;
        }>, "many">;
        isAdmin: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        departments: {
            name: string;
            id: string;
        }[];
        isAdmin?: boolean | undefined;
    }, {
        name: string;
        id: string;
        departments: {
            name: string;
            id: string;
        }[];
        isAdmin?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export type IUserMeVo = z.infer<typeof userMeVoSchema>;
export declare const userMeRoute: RouteConfig;
export declare const userMe: () => Promise<import("axios").AxiosResponse<{
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
