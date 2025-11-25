import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SHARE_VIEW_AGGREGATIONS_LIST = "/share/{shareId}/view/aggregations";
export declare const shareViewAggregationsRoSchema: z.ZodObject<Omit<{
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
    field: z.ZodOptional<z.ZodRecord<z.ZodNativeEnum<typeof import("@teable/core").StatisticsFunc>, z.ZodArray<z.ZodString, "many">>>;
}, "viewId">, "strip", z.ZodTypeAny, {
    filter?: import("@teable/core").IFilterSet | null | undefined;
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
}, {
    filter?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    filterByTql?: string | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
    filterLinkCellCandidate?: string | [string, string] | undefined;
    filterLinkCellSelected?: string | [string, string] | undefined;
    selectedRecordIds?: string[] | undefined;
    groupBy?: string | undefined;
    field?: Partial<Record<import("@teable/core").StatisticsFunc, string[]>> | undefined;
}>;
export type IShareViewAggregationsRo = z.infer<typeof shareViewAggregationsRoSchema>;
export declare const ShareViewAggregationsRoute: RouteConfig;
export declare const getShareViewAggregations: (shareId: string, query?: IShareViewAggregationsRo) => Promise<import("axios").AxiosResponse<{
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
}, any>>;
