import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const groupPointsRoSchema: z.ZodObject<Pick<{
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
}, "filter" | "viewId" | "ignoreViewQuery" | "search" | "groupBy" | "collapsedGroupIds">, "strip", z.ZodTypeAny, {
    filter?: import("@teable/core").IFilterSet | null | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: boolean | undefined;
    search?: [string] | [string, string] | [string, string, boolean] | undefined;
    groupBy?: {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }[] | null | undefined;
    collapsedGroupIds?: string[] | undefined;
}, {
    filter?: string | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
    groupBy?: string | undefined;
    collapsedGroupIds?: string | undefined;
}>;
export type IGroupPointsRo = z.infer<typeof groupPointsRoSchema>;
export declare const GET_GROUP_POINTS = "/table/{tableId}/aggregation/group-points";
export declare const GetGroupPointsRoute: RouteConfig;
export declare const getGroupPoints: (tableId: string, query?: IGroupPointsRo) => Promise<import("axios").AxiosResponse<({
    type: import("./type").GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
} | {
    type: import("./type").GroupPointType.Row;
    count: number;
})[] | null, any>>;
