import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { StatisticsFunc } from '@teable/core';
import { z } from '../zod';
export { StatisticsFunc } from '@teable/core';
export declare const aggregationFieldSchema: z.ZodObject<{
    fieldId: z.ZodString;
    statisticFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
    alias: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    fieldId: string;
    statisticFunc: StatisticsFunc;
    alias?: string | undefined;
}, {
    fieldId: string;
    statisticFunc: StatisticsFunc;
    alias?: string | undefined;
}>;
export type IAggregationField = z.infer<typeof aggregationFieldSchema>;
export declare const aggregationRoSchema: z.ZodObject<{
    viewId: z.ZodOptional<z.ZodString>;
    ignoreViewQuery: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodBoolean]>, boolean, string | boolean>>;
    filterByTql: z.ZodOptional<z.ZodString>;
    filter: z.ZodEffects<z.ZodOptional<z.ZodString>, import("@teable/core").IFilterSet | null | undefined, string | undefined>;
    search: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString, z.ZodUnion<[z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean]>], null>]>>;
    filterLinkCellCandidate: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    filterLinkCellSelected: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    selectedRecordIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
} & Pick<{
    viewId: z.ZodOptional<z.ZodString>;
    ignoreViewQuery: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodBoolean]>, boolean, string | boolean>>;
    filterByTql: z.ZodOptional<z.ZodString>;
    filter: z.ZodEffects<z.ZodOptional<z.ZodString>, import("@teable/core").IFilterSet | null | undefined, string | undefined>;
    search: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString, z.ZodUnion<[z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean]>], null>]>>;
    filterLinkCellCandidate: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    filterLinkCellSelected: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    selectedRecordIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
} & {
    orderBy: z.ZodEffects<z.ZodOptional<z.ZodString>, {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }[] | undefined, string | undefined>;
    groupBy: z.ZodEffects<z.ZodOptional<z.ZodString>, {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }[] | null | undefined, string | undefined>;
    collapsedGroupIds: z.ZodEffects<z.ZodOptional<z.ZodString>, string[] | undefined, string | undefined>;
    queryId: z.ZodOptional<z.ZodString>;
}, "groupBy"> & {
    field: z.ZodOptional<z.ZodRecord<z.ZodNativeEnum<typeof StatisticsFunc>, z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
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
    field?: Partial<Record<StatisticsFunc, string[]>> | undefined;
}, {
    filter?: string | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    filterByTql?: string | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
    filterLinkCellCandidate?: string | [string, string] | undefined;
    filterLinkCellSelected?: string | [string, string] | undefined;
    selectedRecordIds?: string[] | undefined;
    groupBy?: string | undefined;
    field?: Partial<Record<StatisticsFunc, string[]>> | undefined;
}>;
export type IAggregationRo = z.infer<typeof aggregationRoSchema>;
export declare const aggFuncSchema: z.ZodNativeEnum<typeof StatisticsFunc>;
export declare const rawAggregationsValueSchema: z.ZodObject<{
    value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    aggFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
}, "strip", z.ZodTypeAny, {
    value: string | number | null;
    aggFunc: StatisticsFunc;
}, {
    value: string | number | null;
    aggFunc: StatisticsFunc;
}>;
export type IRawAggregationsValue = z.infer<typeof rawAggregationsValueSchema>;
export declare const rawAggregationsSchema: z.ZodArray<z.ZodObject<{
    fieldId: z.ZodString;
    total: z.ZodNullable<z.ZodObject<{
        value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        aggFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | null;
        aggFunc: StatisticsFunc;
    }, {
        value: string | number | null;
        aggFunc: StatisticsFunc;
    }>>;
    group: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        aggFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | null;
        aggFunc: StatisticsFunc;
    }, {
        value: string | number | null;
        aggFunc: StatisticsFunc;
    }>>>>;
}, "strip", z.ZodTypeAny, {
    fieldId: string;
    total: {
        value: string | number | null;
        aggFunc: StatisticsFunc;
    } | null;
    group?: Record<string, {
        value: string | number | null;
        aggFunc: StatisticsFunc;
    }> | null | undefined;
}, {
    fieldId: string;
    total: {
        value: string | number | null;
        aggFunc: StatisticsFunc;
    } | null;
    group?: Record<string, {
        value: string | number | null;
        aggFunc: StatisticsFunc;
    }> | null | undefined;
}>, "many">;
export type IRawAggregations = z.infer<typeof rawAggregationsSchema>;
export declare const baseRawAggregationValueSchema: z.ZodObject<{
    viewId: z.ZodString;
    aggregations: z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        total: z.ZodNullable<z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }>>;
        group: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }>>>>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }>, "many">;
    rowCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    viewId: string;
    aggregations: {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }[];
    rowCount: number;
}, {
    viewId: string;
    aggregations: {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }[];
    rowCount: number;
}>;
export declare const rawAggregationValueSchema: z.ZodObject<{
    aggregations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        total: z.ZodNullable<z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }>>;
        group: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }>>>>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    aggregations?: {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }[] | undefined;
}, {
    aggregations?: {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }[] | undefined;
}>;
export type IRawAggregationValue = z.infer<typeof rawAggregationValueSchema>;
export declare const aggregationVoSchema: z.ZodObject<{
    aggregations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        total: z.ZodNullable<z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }>>;
        group: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }>>>>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    aggregations?: {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }[] | undefined;
}, {
    aggregations?: {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }[] | undefined;
}>;
export type IAggregationVo = z.infer<typeof aggregationVoSchema>;
export declare const GET_AGGREGATION_LIST = "/table/{tableId}/aggregation";
export declare const GetAggregationRoute: RouteConfig;
export declare const getAggregation: (tableId: string, query?: IAggregationRo) => Promise<import("axios").AxiosResponse<{
    aggregations?: {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: StatisticsFunc;
        }> | null | undefined;
    }[] | undefined;
}, any>>;
