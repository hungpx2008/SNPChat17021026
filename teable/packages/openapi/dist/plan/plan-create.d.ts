import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IFieldRo } from '@teable/core';
import { z } from '../zod';
export declare const PLAN_FIELD_CREATE = "/table/{tableId}/field/plan";
export declare const planFieldCreateRoute: RouteConfig;
export declare const planFieldCreate: (tableId: string, fieldRo: IFieldRo) => Promise<import("axios").AxiosResponse<{
    estimateTime: number;
    updateCellCount: number;
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
    linkFieldCount?: number | undefined;
}, any>>;
