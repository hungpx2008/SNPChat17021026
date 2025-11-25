import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_VIEW_FILTER_LINK_RECORDS = "/table/{tableId}/view/{viewId}/filter-link-records";
export declare const getViewFilterLinkRecordsVoSchema: z.ZodArray<z.ZodObject<{
    tableId: z.ZodString;
    records: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title?: string | undefined;
    }, {
        id: string;
        title?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    tableId: string;
    records: {
        id: string;
        title?: string | undefined;
    }[];
}, {
    tableId: string;
    records: {
        id: string;
        title?: string | undefined;
    }[];
}>, "many">;
export type IGetViewFilterLinkRecordsVo = z.infer<typeof getViewFilterLinkRecordsVoSchema>;
export declare const GetViewFilterLinkRecordsRoute: RouteConfig;
export declare const getViewFilterLinkRecords: (tableId: string, viewId: string) => Promise<import("axios").AxiosResponse<{
    tableId: string;
    records: {
        id: string;
        title?: string | undefined;
    }[];
}[], any>>;
