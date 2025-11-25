import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const calendarDailyCollectionRoSchema: z.ZodObject<Pick<{
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
}, "filter" | "viewId" | "ignoreViewQuery" | "search"> & {
    startDate: z.ZodString;
    endDate: z.ZodString;
    startDateFieldId: z.ZodString;
    endDateFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    startDate: string;
    endDate: string;
    startDateFieldId: string;
    endDateFieldId: string;
    filter?: import("@teable/core").IFilterSet | null | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: boolean | undefined;
    search?: [string] | [string, string] | [string, string, boolean] | undefined;
}, {
    startDate: string;
    endDate: string;
    startDateFieldId: string;
    endDateFieldId: string;
    filter?: string | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
}>;
export type ICalendarDailyCollectionRo = z.infer<typeof calendarDailyCollectionRoSchema>;
export declare const calendarDailyCollectionVoSchema: z.ZodObject<{
    countMap: z.ZodRecord<z.ZodString, z.ZodNumber>;
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
    countMap: Record<string, number>;
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
    countMap: Record<string, number>;
}>;
export type ICalendarDailyCollectionVo = z.infer<typeof calendarDailyCollectionVoSchema>;
export declare const GET_CALENDAR_DAILY_COLLECTION = "/table/{tableId}/aggregation/calendar-daily-collection";
export declare const GetCalendarDailyCollectionRoute: RouteConfig;
export declare const getCalendarDailyCollection: (tableId: string, query?: ICalendarDailyCollectionRo) => Promise<import("axios").AxiosResponse<{
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
    countMap: Record<string, number>;
}, any>>;
