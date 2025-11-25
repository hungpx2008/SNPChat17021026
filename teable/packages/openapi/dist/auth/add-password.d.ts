import { z } from '../zod';
export declare const ADD_PASSWORD = "/auth/add-password";
export declare const addPasswordRoSchema: z.ZodObject<{
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
}, {
    password: string;
}>;
export type IAddPasswordRo = z.infer<typeof addPasswordRoSchema>;
export declare const addPasswordRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const addPassword: (ro: IAddPasswordRo) => Promise<import("axios").AxiosResponse<void, any>>;
