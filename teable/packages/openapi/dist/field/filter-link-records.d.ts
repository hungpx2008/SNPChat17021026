import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_FIELD_FILTER_LINK_RECORDS = "/table/{tableId}/field/{fieldId}/filter-link-records";
export declare const getFieldFilterLinkRecordsVoSchema: z.ZodArray<z.ZodObject<{
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
export type IGetFieldFilterLinkRecordsVo = z.infer<typeof getFieldFilterLinkRecordsVoSchema>;
export declare const GetFieldFilterLinkRecordsRoute: RouteConfig;
export declare const getFieldFilterLinkRecords: (tableId: string, fieldId: string) => Promise<import("axios").AxiosResponse<{
    tableId: string;
    records: {
        id: string;
        title?: string | undefined;
    }[];
}[], any>>;
