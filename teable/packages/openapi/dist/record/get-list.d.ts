import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from '../zod';
export declare const queryBaseSchema: z.ZodObject<{
    viewId: z.ZodOptional<z.ZodString>;
    ignoreViewQuery: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodBoolean]>, boolean, string | boolean>>;
    filterByTql: z.ZodOptional<z.ZodString>;
    filter: z.ZodEffects<z.ZodOptional<z.ZodString>, import("@teable/core").IFilterSet | null | undefined, string | undefined>;
    search: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString, z.ZodUnion<[z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean]>], null>]>>;
    filterLinkCellCandidate: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    filterLinkCellSelected: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    selectedRecordIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    filter?: import("@teable/core").IFilterSet | null | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: boolean | undefined;
    filterByTql?: string | undefined;
    search?: [string] | [string, string] | [string, string, boolean] | undefined;
    filterLinkCellCandidate?: string | [string, string] | undefined;
    filterLinkCellSelected?: string | [string, string] | undefined;
    selectedRecordIds?: string[] | undefined;
}, {
    filter?: string | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    filterByTql?: string | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
    filterLinkCellCandidate?: string | [string, string] | undefined;
    filterLinkCellSelected?: string | [string, string] | undefined;
    selectedRecordIds?: string[] | undefined;
}>;
export type IQueryBaseRo = z.infer<typeof queryBaseSchema>;
export declare const orderBySchema: z.ZodArray<z.ZodObject<{
    fieldId: z.ZodString;
    order: z.ZodNativeEnum<typeof import("@teable/core").SortFunc>;
}, "strip", z.ZodTypeAny, {
    fieldId: string;
    order: import("@teable/core").SortFunc;
}, {
    fieldId: string;
    order: import("@teable/core").SortFunc;
}>, "many">;
export declare const contentQueryBaseSchema: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    filter?: import("@teable/core").IFilterSet | null | undefined;
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
    filter?: string | undefined;
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
export declare const getRecordsRoSchema: z.ZodObject<{
    projection: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>, string[], string | string[]>>;
    cellFormat: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof import("@teable/core").CellFormat>>>;
    fieldKeyType: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodNativeEnum<typeof import("@teable/core").FieldKeyType>>, import("@teable/core").FieldKeyType, import("@teable/core").FieldKeyType | undefined>>;
} & {
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
    take: z.ZodOptional<z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, number, string | number>, z.ZodNumber>>>;
    skip: z.ZodOptional<z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, number, string | number>, z.ZodNumber>>>;
}, "strip", z.ZodTypeAny, {
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
}, {
    filter?: string | undefined;
    projection?: string | string[] | undefined;
    cellFormat?: import("@teable/core").CellFormat | undefined;
    fieldKeyType?: import("@teable/core").FieldKeyType | undefined;
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
    take?: string | number | undefined;
    skip?: string | number | undefined;
}>;
export type IGetRecordsRo = z.infer<typeof getRecordsRoSchema>;
export declare const recordsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    fields: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    autoNumber: z.ZodOptional<z.ZodNumber>;
    createdTime: z.ZodOptional<z.ZodString>;
    lastModifiedTime: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodOptional<z.ZodString>;
    lastModifiedBy: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodBoolean>>>;
    undeletable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    fields: Record<string, unknown>;
    createdTime?: string | undefined;
    lastModifiedTime?: string | undefined;
    createdBy?: string | undefined;
    lastModifiedBy?: string | undefined;
    autoNumber?: number | undefined;
    name?: string | undefined;
    permissions?: Record<string, Record<string, boolean>> | undefined;
    undeletable?: boolean | undefined;
}, {
    id: string;
    fields: Record<string, unknown>;
    createdTime?: string | undefined;
    lastModifiedTime?: string | undefined;
    createdBy?: string | undefined;
    lastModifiedBy?: string | undefined;
    autoNumber?: number | undefined;
    name?: string | undefined;
    permissions?: Record<string, Record<string, boolean>> | undefined;
    undeletable?: boolean | undefined;
}>, "many">;
export declare const recordsVoSchema: z.ZodObject<{
    records: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        fields: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        autoNumber: z.ZodOptional<z.ZodNumber>;
        createdTime: z.ZodOptional<z.ZodString>;
        lastModifiedTime: z.ZodOptional<z.ZodString>;
        createdBy: z.ZodOptional<z.ZodString>;
        lastModifiedBy: z.ZodOptional<z.ZodString>;
        permissions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodBoolean>>>;
        undeletable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }, {
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }>, "many">;
    extra: z.ZodOptional<z.ZodObject<{
        groupPoints: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<[z.ZodObject<{
            id: z.ZodString;
            type: z.ZodLiteral<import("../aggregation/type").GroupPointType.Header>;
            depth: z.ZodNumber;
            value: z.ZodUnknown;
            isCollapsed: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            type: import("../aggregation/type").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        }, {
            type: import("../aggregation/type").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        }>, z.ZodObject<{
            type: z.ZodLiteral<import("../aggregation/type").GroupPointType.Row>;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type: import("../aggregation/type").GroupPointType.Row;
            count: number;
        }, {
            type: import("../aggregation/type").GroupPointType.Row;
            count: number;
        }>]>, "many">>>;
        allGroupHeaderRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            depth: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: string;
            depth: number;
        }, {
            id: string;
            depth: number;
        }>, "many">>;
        searchHitIndex: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            recordId: z.ZodString;
            fieldId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            recordId: string;
            fieldId: string;
        }, {
            recordId: string;
            fieldId: string;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        groupPoints?: ({
            type: import("../aggregation/type").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("../aggregation/type").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        allGroupHeaderRefs?: {
            id: string;
            depth: number;
        }[] | undefined;
        searchHitIndex?: {
            recordId: string;
            fieldId: string;
        }[] | null | undefined;
    }, {
        groupPoints?: ({
            type: import("../aggregation/type").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("../aggregation/type").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        allGroupHeaderRefs?: {
            id: string;
            depth: number;
        }[] | undefined;
        searchHitIndex?: {
            recordId: string;
            fieldId: string;
        }[] | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    records: {
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }[];
    extra?: {
        groupPoints?: ({
            type: import("../aggregation/type").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("../aggregation/type").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        allGroupHeaderRefs?: {
            id: string;
            depth: number;
        }[] | undefined;
        searchHitIndex?: {
            recordId: string;
            fieldId: string;
        }[] | null | undefined;
    } | undefined;
}, {
    records: {
        id: string;
        fields: Record<string, unknown>;
        createdTime?: string | undefined;
        lastModifiedTime?: string | undefined;
        createdBy?: string | undefined;
        lastModifiedBy?: string | undefined;
        autoNumber?: number | undefined;
        name?: string | undefined;
        permissions?: Record<string, Record<string, boolean>> | undefined;
        undeletable?: boolean | undefined;
    }[];
    extra?: {
        groupPoints?: ({
            type: import("../aggregation/type").GroupPointType.Header;
            id: string;
            depth: number;
            isCollapsed: boolean;
            value?: unknown;
        } | {
            type: import("../aggregation/type").GroupPointType.Row;
            count: number;
        })[] | null | undefined;
        allGroupHeaderRefs?: {
            id: string;
            depth: number;
        }[] | undefined;
        searchHitIndex?: {
            recordId: string;
            fieldId: string;
        }[] | null | undefined;
    } | undefined;
}>;
export type IRecordsVo = z.infer<typeof recordsVoSchema>;
export declare const GET_RECORDS_URL = "/table/{tableId}/record";
export declare const GetRecordsRoute: RouteConfig;
export declare function getRecords(tableId: string, query?: IGetRecordsRo): Promise<AxiosResponse<IRecordsVo>>;
