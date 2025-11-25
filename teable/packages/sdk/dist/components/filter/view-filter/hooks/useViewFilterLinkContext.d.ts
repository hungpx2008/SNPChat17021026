export declare const useViewFilterLinkContext: (tableId: string | undefined, viewId: string | undefined, config: {
    disabled?: boolean;
}) => {
    isLoading: boolean;
    data: {
        tableId: string;
        data: Record<string, string | undefined>;
    }[] | undefined;
};
