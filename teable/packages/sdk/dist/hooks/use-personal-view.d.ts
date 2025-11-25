export declare const usePersonalView: () => {
    isPersonalView: boolean | undefined;
    personalViewMap: Record<string, unknown> | undefined;
    personalViewCommonQuery: {
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
    personalViewAggregationQuery: {
        filter?: import("@teable/core").IFilterSet | null | undefined;
        viewId?: string | undefined;
        ignoreViewQuery?: boolean | undefined;
        filterByTql?: string | undefined;
        search?: [string] | [string, string] | [string, string, boolean] | undefined;
        filterLinkCellCandidate?: string | [string, string] | undefined;
        filterLinkCellSelected?: string | [string, string] | undefined;
        selectedRecordIds?: string[] | undefined;
        groupBy?: {
            fieldId: string;
            order: import("@teable/core").SortFunc;
        }[] | null | undefined;
        field?: Partial<Record<import("@teable/core").StatisticsFunc, string[]>> | undefined;
    } | undefined;
    openPersonalView: () => void;
    closePersonalView: () => void;
    syncViewProperties: () => Promise<void>;
};
