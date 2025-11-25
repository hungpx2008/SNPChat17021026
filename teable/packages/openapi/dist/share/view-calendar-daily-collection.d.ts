import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SHARE_VIEW_CALENDAR_DAILY_COLLECTION = "/share/{shareId}/view/calendar-daily-collection";
export declare const shareViewCalendarDailyCollectionRoSchema: z.ZodObject<Omit<Pick<{
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
}, "viewId">, "strip", z.ZodTypeAny, {
    startDate: string;
    endDate: string;
    startDateFieldId: string;
    endDateFieldId: string;
    filter?: import("@teable/core").IFilterSet | null | undefined;
    ignoreViewQuery?: boolean | undefined;
    search?: [string] | [string, string] | [string, string, boolean] | undefined;
}, {
    startDate: string;
    endDate: string;
    startDateFieldId: string;
    endDateFieldId: string;
    filter?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
}>;
export type IShareViewCalendarDailyCollectionRo = z.infer<typeof shareViewCalendarDailyCollectionRoSchema>;
export declare const ShareViewCalendarDailyCollectionRoute: RouteConfig;
export declare const getShareViewCalendarDailyCollection: (shareId: string, query: IShareViewCalendarDailyCollectionRo) => Promise<import("axios").AxiosResponse<{
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
