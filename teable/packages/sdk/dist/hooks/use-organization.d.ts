export declare const useOrganization: () => {
    organization: {
        name: string;
        id: string;
        isAdmin: boolean;
    } | null | undefined;
    refetch: () => void;
};
