import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const searchCountVoSchema: z.ZodObject<{
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    count: number;
}, {
    count: number;
}>;
export type ISearchCountVo = z.infer<typeof searchCountVoSchema>;
export declare const GET_Search_COUNT = "/table/{tableId}/aggregation/search-count";
export declare const searchCountRoSchema: z.ZodObject<Pick<{
    viewId: z.ZodOptional<z.ZodString>;
    ignoreViewQuery: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodBoolean]>, boolean, string | boolean>>;
    filterByTql: z.ZodOptional<z.ZodString>;
    filter: z.ZodEffects<z.ZodOptional<z.ZodString>, import("@teable/core").IFilterSet | null | undefined, string | undefined>;
    search: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString, z.ZodUnion<[z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean]>], null>]>>;
    filterLinkCellCandidate: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    filterLinkCellSelected: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    selectedRecordIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "filter" | "viewId" | "ignoreViewQuery" | "search">, "strip", z.ZodTypeAny, {
    filter?: import("@teable/core").IFilterSet | null | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: boolean | undefined;
    search?: [string] | [string, string] | [string, string, boolean] | undefined;
}, {
    filter?: string | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
}>;
export type ISearchCountRo = z.infer<typeof searchCountRoSchema>;
export declare const GetSearchCountRoute: RouteConfig;
export declare const getSearchCount: (tableId: string, query?: ISearchCountRo) => Promise<import("axios").AxiosResponse<{
    count: number;
}, any>>;
