import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DELETE_USER = "/auth/user";
export declare const deleteUserErrorDataSchema: z.ZodObject<{
    spaces: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        deletedTime: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        deletedTime: string | null;
    }, {
        name: string;
        id: string;
        deletedTime: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    spaces: {
        name: string;
        id: string;
        deletedTime: string | null;
    }[];
}, {
    spaces: {
        name: string;
        id: string;
        deletedTime: string | null;
    }[];
}>;
export type IDeleteUserErrorData = z.infer<typeof deleteUserErrorDataSchema>;
export declare const deleteUserSchemaRo: z.ZodObject<{
    confirm: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    confirm: string;
}, {
    confirm: string;
}>;
export type IDeleteUserSchema = z.infer<typeof deleteUserSchemaRo>;
export declare const deleteUserRoute: RouteConfig;
export declare const deleteUser: (confirm: string) => Promise<import("axios").AxiosResponse<any, any>>;
