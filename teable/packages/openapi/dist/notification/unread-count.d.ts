import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const NOTIFICATION_UNREAD_COUNT = "/notifications/unread-count";
export declare const notificationUnreadCountVoSchema: z.ZodObject<{
    unreadCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    unreadCount: number;
}, {
    unreadCount: number;
}>;
export type INotificationUnreadCountVo = z.infer<typeof notificationUnreadCountVoSchema>;
export declare const NotificationUnreadCountRoute: RouteConfig;
export declare const getNotificationUnreadCount: () => Promise<import("axios").AxiosResponse<{
    unreadCount: number;
}, any>>;
