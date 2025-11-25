import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const UPDATE_USER_NAME = "/user/name";
export declare const updateUserNameRoSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type IUpdateUserNameRo = z.infer<typeof updateUserNameRoSchema>;
export declare const UpdateUserNameRoute: RouteConfig;
export declare const updateUserName: (updateUserNameRo: IUpdateUserNameRo) => Promise<import("axios").AxiosResponse<void, any>>;
