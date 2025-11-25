export declare function useSSRRecord(): {
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
} | undefined;
