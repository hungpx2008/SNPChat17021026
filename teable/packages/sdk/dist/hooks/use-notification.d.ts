export declare const useNotification: () => {
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
        notifyType: import("@teable/core").NotificationTypeEnum;
        isRead: boolean;
    };
    unreadCount: number;
} | null;
