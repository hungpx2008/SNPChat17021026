import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { AxiosResponse } from 'axios';
import { z } from 'zod';
export declare const AUTO_FILL_FIELD = "/table/{tableId}/field/{fieldId}/auto-fill";
export declare const autoFillFieldRoSchema: z.ZodObject<Pick<{
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
}, "filter" | "viewId" | "ignoreViewQuery" | "orderBy" | "groupBy">, "strip", z.ZodTypeAny, {
    filter?: import("@teable/core").IFilterSet | null | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: boolean | undefined;
    orderBy?: {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }[] | undefined;
    groupBy?: {
        fieldId: string;
        order: import("@teable/core").SortFunc;
    }[] | null | undefined;
}, {
    filter?: string | undefined;
    viewId?: string | undefined;
    ignoreViewQuery?: string | boolean | undefined;
    orderBy?: string | undefined;
    groupBy?: string | undefined;
}>;
export type IAutoFillFieldRo = z.infer<typeof autoFillFieldRoSchema>;
export declare const autoFillFieldVoSchema: z.ZodObject<{
    taskId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    taskId?: string | null | undefined;
}, {
    taskId?: string | null | undefined;
}>;
export type IAutoFillFieldVo = z.infer<typeof autoFillFieldVoSchema>;
export declare const AutoFillFieldRoute: RouteConfig;
export declare function autoFillField(tableId: string, fieldId: string, query: IAutoFillFieldRo): Promise<AxiosResponse<IAutoFillFieldVo>>;
