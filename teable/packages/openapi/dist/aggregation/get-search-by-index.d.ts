import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const DEFAULT_MAX_SEARCH_FIELD_COUNT: number;
export declare const searchIndexVoSchema: z.ZodNullable<z.ZodArray<z.ZodObject<{
    index: z.ZodNumber;
    fieldId: z.ZodString;
    recordId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    index: number;
    recordId: string;
    fieldId: string;
}, {
    index: number;
    recordId: string;
    fieldId: string;
}>, "many">>;
export type ISearchIndexVo = z.infer<typeof searchIndexVoSchema>;
export declare const searchIndexByQueryRoSchema: z.ZodObject<Omit<{
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
}, "collapsedGroupIds"> & {
    skip: z.ZodOptional<z.ZodNumber>;
    take: z.ZodNumber;
    projection: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    take: number;
    filter?: import("@teable/core").IFilterSet | null | undefined;
    projection?: string[] | undefined;
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
    queryId?: string | undefined;
    skip?: number | undefined;
}, {
    take: number;
    filter?: string | undefined;
    projection?: string[] | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    filterByTql?: string | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
    filterLinkCellCandidate?: string | [string, string] | undefined;
    filterLinkCellSelected?: string | [string, string] | undefined;
    selectedRecordIds?: string[] | undefined;
    orderBy?: string | undefined;
    groupBy?: string | undefined;
    queryId?: string | undefined;
    skip?: number | undefined;
}>;
export type ISearchIndexByQueryRo = z.infer<typeof searchIndexByQueryRoSchema>;
export declare const GET_Search_INDEX = "/table/{tableId}/aggregation/search-index";
export declare const GetSearchIndexRoute: RouteConfig;
export declare const getSearchIndex: (tableId: string, query?: ISearchIndexByQueryRo) => Promise<import("axios").AxiosResponse<{
    index: number;
    recordId: string;
    fieldId: string;
}[] | null, any>>;
