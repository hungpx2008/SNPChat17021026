import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const UPDATE_USER_NOTIFY_META = "/user/notify-meta";
export declare const userNotifyMetaSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: boolean | undefined;
}, {
    email?: boolean | undefined;
}>;
export type IUserNotifyMeta = z.infer<typeof userNotifyMetaSchema>;
export declare const UpdateUserNotifyMetaRoute: RouteConfig;
export declare const updateUserNotifyMeta: (updateUserNotifyMetaRo: IUserNotifyMeta) => Promise<import("axios").AxiosResponse<void, any>>;
