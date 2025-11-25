export declare const useSession: () => {
    user: {
        name: string;
        id: string;
        email: string;
        notifyMeta: {
            email?: boolean | undefined;
        };
        hasPassword: boolean;
        organization?: {
            name: string;
            id: string;
            departments: {
                name: string;
                id: string;
            }[];
            isAdmin?: boolean | undefined;
        } | undefined;
        avatar?: string | null | undefined;
        phone?: string | null | undefined;
        isAdmin?: boolean | null | undefined;
    };
    refresh: () => void;
    refreshAvatar: () => void;
};
