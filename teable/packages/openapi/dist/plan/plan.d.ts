import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const PLAN_FIELD = "/table/{tableId}/field/{fieldId}/plan";
export declare const graphNodeSchema: z.ZodObject<{
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
}, z.ZodTypeAny, "passthrough">>;
export type IGraphNode = z.infer<typeof graphNodeSchema>;
export declare const graphEdgeSchema: z.ZodObject<{
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
}, z.ZodTypeAny, "passthrough">>;
export type IGraphEdge = z.infer<typeof graphEdgeSchema>;
export declare const graphComboSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodString;
    label: z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodString;
    label: z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
export type IGraphCombo = z.infer<typeof graphComboSchema>;
export declare const graphVoSchema: z.ZodOptional<z.ZodObject<{
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
}>>;
export type IGraphVo = z.infer<typeof graphVoSchema>;
export declare const planFieldVoSchema: z.ZodObject<{
    estimateTime: z.ZodNumber;
    graph: z.ZodOptional<z.ZodObject<{
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
    }>>;
    updateCellCount: z.ZodNumber;
    linkFieldCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
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
}, {
    estimateTime: number;
    updateCellCount: number;
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
    linkFieldCount?: number | undefined;
}>;
export type IPlanFieldVo = z.infer<typeof planFieldVoSchema>;
export declare const planFieldRoute: RouteConfig;
export declare const planField: (tableId: string, fieldId: string) => Promise<import("axios").AxiosResponse<{
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
