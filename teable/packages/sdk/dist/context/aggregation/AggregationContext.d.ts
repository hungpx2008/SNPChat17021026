import React from 'react';
export declare const AggregationContext: React.Context<{
    aggregations?: {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: import("@teable/openapi").StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: import("@teable/openapi").StatisticsFunc;
        }> | null | undefined;
    }[] | undefined;
} | null>;
