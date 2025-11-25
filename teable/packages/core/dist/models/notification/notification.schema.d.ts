import { z } from 'zod';
import { NotificationTypeEnum } from './notification.enum';
export declare const systemIconSchema: z.ZodObject<{
    iconUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    iconUrl: string;
}, {
    iconUrl: string;
}>;
export type INotificationSystemIcon = z.infer<typeof systemIconSchema>;
export declare const userIconSchema: z.ZodObject<{
    userId: z.ZodString;
    userName: z.ZodString;
    userAvatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    userName: string;
    userAvatarUrl?: string | null | undefined;
}, {
    userId: string;
    userName: string;
    userAvatarUrl?: string | null | undefined;
}>;
export type INotificationUserIcon = z.infer<typeof userIconSchema>;
export declare const notificationIconSchema: z.ZodUnion<[z.ZodObject<{
    iconUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    iconUrl: string;
}, {
    iconUrl: string;
}>, z.ZodObject<{
    userId: z.ZodString;
    userName: z.ZodString;
    userAvatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    userName: string;
    userAvatarUrl?: string | null | undefined;
}, {
    userId: string;
    userName: string;
    userAvatarUrl?: string | null | undefined;
}>]>;
export type INotificationIcon = z.infer<typeof notificationIconSchema>;
export declare const tableRecordUrlSchema: z.ZodObject<{
    baseId: z.ZodString;
    tableId: z.ZodString;
    recordId: z.ZodOptional<z.ZodString>;
    commentId: z.ZodOptional<z.ZodString>;
    downloadUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    baseId: string;
    tableId: string;
    recordId?: string | undefined;
    commentId?: string | undefined;
    downloadUrl?: string | undefined;
}, {
    baseId: string;
    tableId: string;
    recordId?: string | undefined;
    commentId?: string | undefined;
    downloadUrl?: string | undefined;
}>;
export declare const notificationUrlSchema: z.ZodOptional<z.ZodObject<{
    baseId: z.ZodString;
    tableId: z.ZodString;
    recordId: z.ZodOptional<z.ZodString>;
    commentId: z.ZodOptional<z.ZodString>;
    downloadUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    baseId: string;
    tableId: string;
    recordId?: string | undefined;
    commentId?: string | undefined;
    downloadUrl?: string | undefined;
}, {
    baseId: string;
    tableId: string;
    recordId?: string | undefined;
    commentId?: string | undefined;
    downloadUrl?: string | undefined;
}>>;
export type INotificationUrl = z.infer<typeof notificationUrlSchema>;
export declare const notificationSchema: z.ZodObject<{
    id: z.ZodString;
    notifyIcon: z.ZodUnion<[z.ZodObject<{
        iconUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        iconUrl: string;
    }, {
        iconUrl: string;
    }>, z.ZodObject<{
        userId: z.ZodString;
        userName: z.ZodString;
        userAvatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        userName: string;
        userAvatarUrl?: string | null | undefined;
    }, {
        userId: string;
        userName: string;
        userAvatarUrl?: string | null | undefined;
    }>]>;
    notifyType: z.ZodNativeEnum<typeof NotificationTypeEnum>;
    url: z.ZodString;
    message: z.ZodString;
    isRead: z.ZodBoolean;
    createdTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    createdTime: string;
    id: string;
    message: string;
    url: string;
    notifyIcon: {
        iconUrl: string;
    } | {
        userId: string;
        userName: string;
        userAvatarUrl?: string | null | undefined;
    };
    notifyType: NotificationTypeEnum;
    isRead: boolean;
}, {
    createdTime: string;
    id: string;
    message: string;
    url: string;
    notifyIcon: {
        iconUrl: string;
    } | {
        userId: string;
        userName: string;
        userAvatarUrl?: string | null | undefined;
    };
    notifyType: NotificationTypeEnum;
    isRead: boolean;
}>;
export type INotification = z.infer<typeof notificationSchema>;
export declare const notificationBufferSchema: z.ZodObject<{
    notification: z.ZodObject<{
        id: z.ZodString;
        notifyIcon: z.ZodUnion<[z.ZodObject<{
            iconUrl: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            iconUrl: string;
        }, {
            iconUrl: string;
        }>, z.ZodObject<{
            userId: z.ZodString;
            userName: z.ZodString;
            userAvatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            userId: string;
            userName: string;
            userAvatarUrl?: string | null | undefined;
        }, {
            userId: string;
            userName: string;
            userAvatarUrl?: string | null | undefined;
        }>]>;
        notifyType: z.ZodNativeEnum<typeof NotificationTypeEnum>;
        url: z.ZodString;
        message: z.ZodString;
        isRead: z.ZodBoolean;
        createdTime: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        createdTime: string;
        id: string;
        message: string;
        url: string;
        notifyIcon: {
            iconUrl: string;
        } | {
            userId: string;
            userName: string;
            userAvatarUrl?: string | null | undefined;
        };
        notifyType: NotificationTypeEnum;
        isRead: boolean;
    }, {
        createdTime: string;
        id: string;
        message: string;
        url: string;
        notifyIcon: {
            iconUrl: string;
        } | {
            userId: string;
            userName: string;
            userAvatarUrl?: string | null | undefined;
        };
        notifyType: NotificationTypeEnum;
        isRead: boolean;
    }>;
    unreadCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    notification: {
        createdTime: string;
        id: string;
        message: string;
        url: string;
        notifyIcon: {
            iconUrl: string;
        } | {
            userId: string;
            userName: string;
            userAvatarUrl?: string | null | undefined;
        };
        notifyType: NotificationTypeEnum;
        isRead: boolean;
    };
    unreadCount: number;
}, {
    notification: {
        createdTime: string;
        id: string;
        message: string;
        url: string;
        notifyIcon: {
            iconUrl: string;
        } | {
            userId: string;
            userName: string;
            userAvatarUrl?: string | null | undefined;
        };
        notifyType: NotificationTypeEnum;
        isRead: boolean;
    };
    unreadCount: number;
}>;
export type INotificationBuffer = z.infer<typeof notificationBufferSchema>;
