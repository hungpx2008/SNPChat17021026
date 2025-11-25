import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IQueryBaseRo } from '../record';
import { z } from '../zod';
export declare const rawRowCountValueSchema: z.ZodObject<Pick<{
    viewId: z.ZodString;
    aggregations: z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        total: z.ZodNullable<z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }>>;
        group: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }>>>>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }> | null | undefined;
    }, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }> | null | undefined;
    }>, "many">;
    rowCount: z.ZodNumber;
}, "rowCount">, "strip", z.ZodTypeAny, {
    rowCount: number;
}, {
    rowCount: number;
}>;
export type IRawRowCountValue = z.infer<typeof rawRowCountValueSchema>;
export declare const rowCountVoSchema: z.ZodObject<Pick<{
    viewId: z.ZodString;
    aggregations: z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        total: z.ZodNullable<z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }>>;
        group: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
            aggFunc: z.ZodNativeEnum<typeof import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }>>>>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }> | null | undefined;
    }, {
        fieldId: string;
        total: {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        } | null;
        group?: Record<string, {
            value: string | number | null;
            aggFunc: import("@teable/core/dist/models/aggregation/statistics-func.enum").StatisticsFunc;
        }> | null | undefined;
    }>, "many">;
    rowCount: z.ZodNumber;
}, "rowCount">, "strip", z.ZodTypeAny, {
    rowCount: number;
}, {
    rowCount: number;
}>;
export type IRowCountVo = z.infer<typeof rowCountVoSchema>;
export declare const GET_ROW_COUNT = "/table/{tableId}/aggregation/row-count";
export declare const GetRowCountRoute: RouteConfig;
export declare const getRowCount: (tableId: string, query?: IQueryBaseRo) => Promise<import("axios").AxiosResponse<{
    rowCount: number;
}, any>>;
