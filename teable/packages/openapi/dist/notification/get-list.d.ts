import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { NotificationStatesEnum } from '@teable/core';
import { z } from '../zod';
export declare const NOTIFICATION_LIST = "/notifications";
export declare const getNotifyListQuerySchema: z.ZodObject<{
    notifyStates: z.ZodNativeEnum<typeof NotificationStatesEnum>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    notifyStates: NotificationStatesEnum;
    cursor?: string | null | undefined;
}, {
    notifyStates: NotificationStatesEnum;
    cursor?: string | null | undefined;
}>;
export type IGetNotifyListQuery = z.infer<typeof getNotifyListQuerySchema>;
export declare const notificationListVoSchema: z.ZodArray<z.ZodObject<{
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
    notifyType: z.ZodNativeEnum<typeof import("@teable/core").NotificationTypeEnum>;
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
    notifyType: import("@teable/core").NotificationTypeEnum;
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
    notifyType: import("@teable/core").NotificationTypeEnum;
    isRead: boolean;
}>, "many">;
export type INotificationList = z.infer<typeof notificationListVoSchema>;
export declare const notificationVoSchema: z.ZodObject<{
    notifications: z.ZodArray<z.ZodObject<{
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
        notifyType: z.ZodNativeEnum<typeof import("@teable/core").NotificationTypeEnum>;
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
        notifyType: import("@teable/core").NotificationTypeEnum;
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
        notifyType: import("@teable/core").NotificationTypeEnum;
        isRead: boolean;
    }>, "many">;
    nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    notifications: {
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
        notifyType: import("@teable/core").NotificationTypeEnum;
        isRead: boolean;
    }[];
    nextCursor?: string | null | undefined;
}, {
    notifications: {
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
        notifyType: import("@teable/core").NotificationTypeEnum;
        isRead: boolean;
    }[];
    nextCursor?: string | null | undefined;
}>;
export type INotificationVo = z.infer<typeof notificationVoSchema>;
export declare const NotificationListRoute: RouteConfig;
export declare const getNotificationList: (query: IGetNotifyListQuery) => Promise<import("axios").AxiosResponse<{
    notifications: {
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
        notifyType: import("@teable/core").NotificationTypeEnum;
        isRead: boolean;
    }[];
    nextCursor?: string | null | undefined;
}, any>>;
