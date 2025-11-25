export declare const useGroupPoint: () => ({
    type: import("@teable/openapi").GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
} | {
    type: import("@teable/openapi").GroupPointType.Row;
    count: number;
})[] | null;
