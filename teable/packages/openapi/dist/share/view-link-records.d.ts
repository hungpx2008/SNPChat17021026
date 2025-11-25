import { z } from '../zod';
export declare const SHARE_VIEW_LINK_RECORDS = "/share/{shareId}/view/link-records";
export declare enum ShareViewLinkRecordsType {
    Candidate = "candidate",
    Selected = "selected"
}
export declare const shareViewLinkRecordsRoSchema: z.ZodObject<Pick<{
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
}, "take" | "skip"> & {
    fieldId: z.ZodString;
    search: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof ShareViewLinkRecordsType>>;
}, "strip", z.ZodTypeAny, {
    fieldId: string;
    type?: ShareViewLinkRecordsType | undefined;
    search?: string | undefined;
    take?: number | undefined;
    skip?: number | undefined;
}, {
    fieldId: string;
    type?: ShareViewLinkRecordsType | undefined;
    search?: string | undefined;
    take?: string | number | undefined;
    skip?: string | number | undefined;
}>;
export type IShareViewLinkRecordsRo = z.infer<typeof shareViewLinkRecordsRoSchema>;
export declare const shareViewLinkRecordsVoSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title?: string | undefined;
}, {
    id: string;
    title?: string | undefined;
}>, "many">;
export type IShareViewLinkRecordsVo = z.infer<typeof shareViewLinkRecordsVoSchema>;
export declare const ShareViewLinkRecordsRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const getShareViewLinkRecords: (shareId: string, query: IShareViewLinkRecordsRo) => Promise<import("axios").AxiosResponse<{
    id: string;
    title?: string | undefined;
}[], any>>;
