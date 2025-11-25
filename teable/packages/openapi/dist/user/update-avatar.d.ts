import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const UPDATE_USER_AVATAR = "/user/avatar";
export declare const updateUserAvatarRoSchema: z.ZodObject<{
    file: z.ZodString;
}, "strip", z.ZodTypeAny, {
    file: string;
}, {
    file: string;
}>;
export type IUpdateUserAvatarRo = z.infer<typeof updateUserAvatarRoSchema>;
export declare const UpdateUserAvatarRoute: RouteConfig;
export declare const updateUserAvatar: (updateUserAvatarRo: IUpdateUserAvatarRo) => Promise<import("axios").AxiosResponse<void, any>>;
