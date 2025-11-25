import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IConvertFieldRo } from '@teable/core';
import { z } from '../zod';
export declare const PLAN_FIELD_CONVERT = "/table/{tableId}/field/{fieldId}/plan";
export declare const planFieldConvertVoSchema: z.ZodObject<{
    estimateTime: z.ZodOptional<z.ZodNumber>;
    graph: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        nodes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            comboId: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            comboId: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            comboId: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        edges: z.ZodArray<z.ZodObject<{
            source: z.ZodString;
            target: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            source: z.ZodString;
            target: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            source: z.ZodString;
            target: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        combos: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            label: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            label: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "strip", z.ZodTypeAny, {
        nodes: z.objectOutputType<{
            id: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            comboId: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        edges: z.objectOutputType<{
            source: z.ZodString;
            target: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        combos: z.objectOutputType<{
            id: z.ZodString;
            label: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
    }, {
        nodes: z.objectInputType<{
            id: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            comboId: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        edges: z.objectInputType<{
            source: z.ZodString;
            target: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        combos: z.objectInputType<{
            id: z.ZodString;
            label: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
    }>>>;
    updateCellCount: z.ZodOptional<z.ZodNumber>;
    linkFieldCount: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
} & {
    skip: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    skip?: boolean | undefined;
    estimateTime?: number | undefined;
    graph?: {
        nodes: z.objectOutputType<{
            id: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            comboId: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        edges: z.objectOutputType<{
            source: z.ZodString;
            target: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        combos: z.objectOutputType<{
            id: z.ZodString;
            label: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
    } | undefined;
    updateCellCount?: number | undefined;
    linkFieldCount?: number | undefined;
}, {
    skip?: boolean | undefined;
    estimateTime?: number | undefined;
    graph?: {
        nodes: z.objectInputType<{
            id: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            comboId: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        edges: z.objectInputType<{
            source: z.ZodString;
            target: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        combos: z.objectInputType<{
            id: z.ZodString;
            label: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
    } | undefined;
    updateCellCount?: number | undefined;
    linkFieldCount?: number | undefined;
}>;
export type IPlanFieldConvertVo = z.infer<typeof planFieldConvertVoSchema>;
export declare const planFieldConvertRoute: RouteConfig;
export declare const planFieldConvert: (tableId: string, fieldId: string, fieldRo: IConvertFieldRo) => Promise<import("axios").AxiosResponse<{
    skip?: boolean | undefined;
    estimateTime?: number | undefined;
    graph?: {
        nodes: z.objectOutputType<{
            id: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            comboId: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        edges: z.objectOutputType<{
            source: z.ZodString;
            target: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        combos: z.objectOutputType<{
            id: z.ZodString;
            label: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
    } | undefined;
    updateCellCount?: number | undefined;
    linkFieldCount?: number | undefined;
}, any>>;
