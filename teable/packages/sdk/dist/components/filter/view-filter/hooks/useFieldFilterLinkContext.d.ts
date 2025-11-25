export declare const useFieldFilterLinkContext: (tableId: string, fieldId?: string, disabled?: boolean) => {
    isLoading: boolean;
    data: {
        tableId: string;
        data: Record<string, string | undefined>;
    }[] | undefined;
};
