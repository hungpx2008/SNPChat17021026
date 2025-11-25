export declare const useAggregation: () => {
    aggregations?: {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: import("@teable/core").StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: import("@teable/core").StatisticsFunc;
        }> | null | undefined;
    }[] | undefined;
} | null;
