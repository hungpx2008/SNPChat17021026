import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SHARE_VIEW_GROUP_POINTS = "/share/{shareId}/view/group-points";
export declare const shareViewGroupPointsRoSchema: z.ZodObject<Omit<Pick<{
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
}, "filter" | "viewId" | "ignoreViewQuery" | "search" | "groupBy" | "collapsedGroupIds">, "viewId">, "strip", z.ZodTypeAny, {
    filter?: import("@teable/core").IFilterSet | null | undefined;
    ignoreViewQuery?: boolean | undefined;
    search?: [string] | [string, string] | [string, string, boolean] | undefined;
    groupBy?: {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }[] | null | undefined;
    collapsedGroupIds?: string[] | undefined;
}, {
    filter?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
    groupBy?: string | undefined;
    collapsedGroupIds?: string | undefined;
}>;
export type IShareViewGroupPointsRo = z.infer<typeof shareViewGroupPointsRoSchema>;
export declare const ShareViewGroupPointsRoute: RouteConfig;
export declare const getShareViewGroupPoints: (shareId: string, query?: IShareViewGroupPointsRo) => Promise<import("axios").AxiosResponse<({
    type: import("../aggregation").GroupPointType.Header;
    id: string;
    depth: number;
    isCollapsed: boolean;
    value?: unknown;
} | {
    type: import("../aggregation").GroupPointType.Row;
    count: number;
})[] | null, any>>;
