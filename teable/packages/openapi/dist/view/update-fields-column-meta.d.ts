import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const VIEW_COLUMN_META = "/table/{tableId}/view/{viewId}/column-meta";
export declare const updateViewColumnMetaRoute: RouteConfig;
export declare const updateViewColumnMeta: (tableId: string, viewId: string, columnMetaRo: {
    fieldId: string;
    columnMeta: {
        width?: number | undefined;
        order?: number | undefined;
        hidden?: boolean | undefined;
        statisticFunc?: import("@teable/core").StatisticsFunc | null | undefined;
    } | {
        order?: number | undefined;
        visible?: boolean | undefined;
    } | {
        required?: boolean | undefined;
        order?: number | undefined;
        visible?: boolean | undefined;
    } | {
        order?: number | undefined;
        hidden?: boolean | undefined;
    };
}[]) => Promise<import("axios").AxiosResponse<void, any>>;
