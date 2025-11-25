import type { IGetRecordsRo } from '@teable/openapi';
export declare const useGridCollapsedGroup: (cacheKey: string, initQuery?: IGetRecordsRo) => {
    viewQuery: {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        projection?: string[] | undefined;
        cellFormat?: import("@teable/core").CellFormat | undefined;
        fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
        viewId?: string | undefined;
        ignoreViewQuery?: boolean | undefined;
        filterByTql?: string | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        filterLinkCellCandidate?: string | [string, string] | undefined;
        filterLinkCellSelected?: string | [string, string] | undefined;
        selectedRecordIds?: string[] | undefined;
        orderBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | undefined;
        groupBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        collapsedGroupIds?: string[] | undefined;
        queryId?: string | undefined;
        take?: number | undefined;
        skip?: number | undefined;
    } | undefined;
    collapsedGroupIds?: undefined;
    onCollapsedGroupChanged?: undefined;
} | {
    viewQuery: {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        projection?: string[] | undefined;
        cellFormat?: import("@teable/core").CellFormat | undefined;
        fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
        viewId?: string | undefined;
        ignoreViewQuery?: boolean | undefined;
        filterByTql?: string | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        filterLinkCellCandidate?: string | [string, string] | undefined;
        filterLinkCellSelected?: string | [string, string] | undefined;
        selectedRecordIds?: string[] | undefined;
        orderBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | undefined;
        groupBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        collapsedGroupIds?: string[] | undefined;
        queryId?: string | undefined;
        take?: number | undefined;
        skip?: number | undefined;
    } | undefined;
    collapsedGroupIds: Set<string> | null;
    onCollapsedGroupChanged: (groupIds: Set<string>) => void;
};
