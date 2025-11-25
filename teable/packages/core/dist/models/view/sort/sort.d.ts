import { z } from '../../../zod';
import { SortFunc } from './sort-func.enum';
export declare const orderSchema: z.ZodNativeEnum<typeof SortFunc>;
export declare const sortItemSchema: z.ZodObject<{
    fieldId: z.ZodString;
    order: z.ZodNativeEnum<typeof SortFunc>;
}, "strip", z.ZodTypeAny, {
    fieldId: string;
    order: SortFunc;
}, {
    fieldId: string;
    order: SortFunc;
}>;
export declare const sortSchema: z.ZodNullable<z.ZodObject<{
    sortObjs: z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: SortFunc;
    }, {
        fieldId: string;
        order: SortFunc;
    }>, "many">;
    manualSort: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    sortObjs: {
        fieldId: string;
        order: SortFunc;
    }[];
    manualSort?: boolean | undefined;
}, {
    sortObjs: {
        fieldId: string;
        order: SortFunc;
    }[];
    manualSort?: boolean | undefined;
}>>;
export declare const sortStringSchema: z.ZodEffects<z.ZodString, {
    sortObjs: {
        fieldId: string;
        order: SortFunc;
    }[];
    manualSort?: boolean | undefined;
} | null, string>;
export type ISortItem = z.infer<typeof sortItemSchema>;
export type ISort = z.infer<typeof sortSchema>;
export declare const manualSortRoSchema: z.ZodObject<{
    sortObjs: z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: SortFunc;
    }, {
        fieldId: string;
        order: SortFunc;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    sortObjs: {
        fieldId: string;
        order: SortFunc;
    }[];
}, {
    sortObjs: {
        fieldId: string;
        order: SortFunc;
    }[];
}>;
export type IManualSortRo = z.infer<typeof manualSortRoSchema>;
export declare function mergeWithDefaultSort(defaultViewSort?: string | null, querySort?: ISortItem[]): ISortItem[];
