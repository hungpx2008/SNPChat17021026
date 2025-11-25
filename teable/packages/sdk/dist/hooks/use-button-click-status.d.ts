export interface IButtonClickStatus {
    runId: string;
    recordId: string;
    fieldId: string;
    loading: boolean;
    name: string;
    message?: string;
    errorMessage?: string;
}
export declare const useButtonClickStatus: (tableId: string, shareId?: string) => {
    checkLoading: (fieldId: string, recordId: string) => boolean;
    buttonClick: (ro: {
        tableId: string;
        recordId: string;
        fieldId: string;
        name: string;
    }) => Promise<import("axios").AxiosResponse<{
        record: {
            id: string;
            fields: Record<string, unknown>;
            createdTime?: string | undefined;
            lastModifiedTime?: string | undefined;
            createdBy?: string | undefined;
            lastModifiedBy?: string | undefined;
            autoNumber?: number | undefined;
            name?: string | undefined;
            permissions?: Record<string, Record<string, boolean>> | undefined;
            undeletable?: boolean | undefined;
        };
        tableId: string;
        fieldId: string;
        runId: string;
    }, any>>;
};
export type IButtonClickStatusHook = ReturnType<typeof useButtonClickStatus>;
