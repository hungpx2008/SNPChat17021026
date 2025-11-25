import { z } from 'zod';
import type { IConjunction } from './conjunction';
import type { IFilterItem } from './filter-item';
export declare const baseFilterSetSchema: z.ZodObject<{
    conjunction: z.ZodUnion<[z.ZodLiteral<"and">, z.ZodLiteral<"or">]>;
}, "strip", z.ZodTypeAny, {
    conjunction: "and" | "or";
}, {
    conjunction: "and" | "or";
}>;
export type IFilterSet = z.infer<typeof baseFilterSetSchema> & {
    filterSet: (IFilterItem | IFilterSet)[];
};
export declare const nestedFilterItemSchema: z.ZodType<IFilterSet>;
export declare const FILTER_DESCRIPTION = "A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters.";
export declare const filterSchema: z.ZodNullable<z.ZodType<IFilterSet, z.ZodTypeDef, IFilterSet>>;
export type IFilter = z.infer<typeof filterSchema>;
export declare const filterRoSchema: z.ZodObject<{
    filter: z.ZodNullable<z.ZodType<IFilterSet, z.ZodTypeDef, IFilterSet>>;
}, "strip", z.ZodTypeAny, {
    filter: IFilterSet | null;
}, {
    filter: IFilterSet | null;
}>;
export type IFilterRo = z.infer<typeof filterRoSchema>;
export declare const filterStringSchema: z.ZodEffects<z.ZodString, IFilterSet | null, string>;
export declare function mergeWithDefaultFilter(defaultViewFilter?: string | null, queryFilter?: IFilter): IFilter | undefined;
export declare const mergeFilter: (filter1?: IFilter, filter2?: IFilter, conjunction?: IConjunction) => IFilterSet | null | undefined;
export declare const extractFieldIdsFromFilter: (filter?: IFilter, includeValueFieldIds?: boolean) => string[];
