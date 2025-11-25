import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const UPDATE_NOTIFICATION_STATUS = "/notifications/{notificationId}/status";
export declare const updateNotifyStatusRoSchema: z.ZodObject<{
    isRead: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isRead: boolean;
}, {
    isRead: boolean;
}>;
export type IUpdateNotifyStatusRo = z.infer<typeof updateNotifyStatusRoSchema>;
export declare const UpdateNotificationStatusRoute: RouteConfig;
export declare const updateNotificationStatus: (params: {
    notificationId: string;
    updateNotifyStatusRo: IUpdateNotifyStatusRo;
}) => Promise<import("axios").AxiosResponse<void, any>>;
