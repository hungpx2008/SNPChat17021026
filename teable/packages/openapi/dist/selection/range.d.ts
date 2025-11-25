import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_IDS_FROM_RANGES_URL = "/table/{tableId}/selection/range-to-id";
export declare enum RangeType {
    Rows = "rows",
    Columns = "columns"
}
export declare const cellSchema: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
export type ICell = z.infer<typeof cellSchema>;
export declare const rangesSchema: z.ZodArray<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, "many">;
export declare const rangesRoSchema: z.ZodObject<{
    viewId: z.ZodOptional<z.ZodString>;
    ignoreViewQuery: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodBoolean]>, boolean, string | boolean>>;
    filterByTql: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString, z.ZodUnion<[z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean]>], null>]>>;
    filterLinkCellCandidate: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    filterLinkCellSelected: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    selectedRecordIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    queryId: z.ZodOptional<z.ZodString>;
} & {
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("@teable/core").IFilterSet, z.ZodTypeDef, import("@teable/core").IFilterSet>>>;
    orderBy: z.ZodOptional<z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }, {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }>, "many">>;
    groupBy: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }, {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }>, "many">>>;
    collapsedGroupIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    projection: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    ranges: z.ZodArray<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, "many">;
    type: z.ZodOptional<z.ZodNativeEnum<typeof RangeType>>;
}, "strip", z.ZodTypeAny, {
    ranges: [number, number][];
    filter?: import("@teable/core").IFilterSet | null | undefined;
    type?: RangeType | undefined;
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
    collapsedGroupIds?: string[] | undefined;
    queryId?: string | undefined;
}, {
    ranges: [number, number][];
    filter?: import("@teable/core").IFilterSet | null | undefined;
    type?: RangeType | undefined;
    projection?: string[] | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    filterByTql?: string | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
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
}>;
export type IRangesRo = z.infer<typeof rangesRoSchema>;
export declare const rangesQuerySchema: z.ZodObject<{
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
} & {
    projection: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    ranges: z.ZodEffects<z.ZodString, [number, number][], string>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof RangeType>>;
}, "strip", z.ZodTypeAny, {
    ranges: [number, number][];
    filter?: import("@teable/core").IFilterSet | null | undefined;
    type?: RangeType | undefined;
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
    collapsedGroupIds?: string[] | undefined;
    queryId?: string | undefined;
}, {
    ranges: string;
    filter?: string | undefined;
    type?: RangeType | undefined;
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
    collapsedGroupIds?: string | undefined;
    queryId?: string | undefined;
}>;
export declare enum IdReturnType {
    RecordId = "recordId",
    FieldId = "fieldId",
    All = "all"
}
export declare const rangesToIdQuerySchema: z.ZodObject<{
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
} & {
    projection: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    ranges: z.ZodEffects<z.ZodString, [number, number][], string>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof RangeType>>;
} & {
    returnType: z.ZodNativeEnum<typeof IdReturnType>;
}, "strip", z.ZodTypeAny, {
    ranges: [number, number][];
    returnType: IdReturnType;
    filter?: import("@teable/core").IFilterSet | null | undefined;
    type?: RangeType | undefined;
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
    collapsedGroupIds?: string[] | undefined;
    queryId?: string | undefined;
}, {
    ranges: string;
    returnType: IdReturnType;
    filter?: string | undefined;
    type?: RangeType | undefined;
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
    collapsedGroupIds?: string | undefined;
    queryId?: string | undefined;
}>;
export type IRangesToIdQuery = z.infer<typeof rangesToIdQuerySchema>;
export declare const rangesToIdVoSchema: z.ZodObject<{
    recordIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    fieldIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    recordIds?: string[] | undefined;
    fieldIds?: string[] | undefined;
}, {
    recordIds?: string[] | undefined;
    fieldIds?: string[] | undefined;
}>;
export type IRangesToIdVo = z.infer<typeof rangesToIdVoSchema>;
export declare const GetIdsFromRangesRoute: RouteConfig;
export declare const getIdsFromRanges: (tableId: string, rangesToIdQuery: IRangesToIdQuery) => Promise<import("axios").AxiosResponse<{
    recordIds?: string[] | undefined;
    fieldIds?: string[] | undefined;
}, any>>;
