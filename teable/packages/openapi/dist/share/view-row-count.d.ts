import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const SHARE_VIEW_ROW_COUNT = "/share/{shareId}/view/row-count";
export declare const shareViewRowCountRoSchema: z.ZodObject<Omit<{
    viewId: z.ZodOptional<z.ZodString>;
    ignoreViewQuery: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodBoolean]>, boolean, string | boolean>>;
    filterByTql: z.ZodOptional<z.ZodString>;
    filter: z.ZodEffects<z.ZodOptional<z.ZodString>, import("@teable/core").IFilterSet | null | undefined, string | undefined>;
    search: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodTuple<[z.ZodString, z.ZodString, z.ZodUnion<[z.ZodEffects<z.ZodString, boolean, string>, z.ZodBoolean]>], null>]>>;
    filterLinkCellCandidate: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    filterLinkCellSelected: z.ZodOptional<z.ZodUnion<[z.ZodTuple<[z.ZodString, z.ZodString], null>, z.ZodString]>>;
    selectedRecordIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "viewId">, "strip", z.ZodTypeAny, {
    filter?: import("@teable/core").IFilterSet | null | undefined;
    ignoreViewQuery?: boolean | undefined;
    filterByTql?: string | undefined;
    search?: [string] | [string, string] | [string, string, boolean] | undefined;
    filterLinkCellCandidate?: string | [string, string] | undefined;
    filterLinkCellSelected?: string | [string, string] | undefined;
    selectedRecordIds?: string[] | undefined;
}, {
    filter?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    filterByTql?: string | undefined;
    search?: [string] | [string, string] | [string, string, string | boolean] | undefined;
    filterLinkCellCandidate?: string | [string, string] | undefined;
    filterLinkCellSelected?: string | [string, string] | undefined;
    selectedRecordIds?: string[] | undefined;
}>;
export type IShareViewRowCountRo = z.infer<typeof shareViewRowCountRoSchema>;
export declare const ShareViewRowCountRoute: RouteConfig;
export declare const getShareViewRowCount: (shareId: string, query: IShareViewRowCountRo) => Promise<import("axios").AxiosResponse<{
    rowCount: number;
}, any>>;
