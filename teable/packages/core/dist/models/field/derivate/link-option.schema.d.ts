import { z } from '../../../zod';
import { Relationship } from '../constant';
export declare const linkFieldOptionsSchema: z.ZodObject<{
    baseId: z.ZodOptional<z.ZodString>;
    relationship: z.ZodNativeEnum<typeof Relationship>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    isOneWay: z.ZodOptional<z.ZodBoolean>;
    fkHostTableName: z.ZodString;
    selfKeyName: z.ZodString;
    foreignKeyName: z.ZodString;
    symmetricFieldId: z.ZodOptional<z.ZodString>;
    filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("../../view/filter").IFilterSet, z.ZodTypeDef, import("../../view/filter").IFilterSet>>>;
}, "strip", z.ZodTypeAny, {
    foreignTableId: string;
    lookupFieldId: string;
    relationship: Relationship;
    fkHostTableName: string;
    selfKeyName: string;
    foreignKeyName: string;
    filter?: import("../../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
    isOneWay?: boolean | undefined;
    symmetricFieldId?: string | undefined;
    filterByViewId?: string | null | undefined;
    visibleFieldIds?: string[] | null | undefined;
}, {
    foreignTableId: string;
    lookupFieldId: string;
    relationship: Relationship;
    fkHostTableName: string;
    selfKeyName: string;
    foreignKeyName: string;
    filter?: import("../../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
    isOneWay?: boolean | undefined;
    symmetricFieldId?: string | undefined;
    filterByViewId?: string | null | undefined;
    visibleFieldIds?: string[] | null | undefined;
}>;
export type ILinkFieldOptions = z.infer<typeof linkFieldOptionsSchema>;
export declare const linkFieldMetaSchema: z.ZodObject<{
    hasOrderColumn: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    hasOrderColumn: boolean;
}, {
    hasOrderColumn?: boolean | undefined;
}>;
export type ILinkFieldMeta = z.infer<typeof linkFieldMetaSchema>;
export declare const linkFieldOptionsRoSchema: z.ZodObject<Pick<{
    baseId: z.ZodOptional<z.ZodString>;
    relationship: z.ZodNativeEnum<typeof Relationship>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    isOneWay: z.ZodOptional<z.ZodBoolean>;
    fkHostTableName: z.ZodString;
    selfKeyName: z.ZodString;
    foreignKeyName: z.ZodString;
    symmetricFieldId: z.ZodOptional<z.ZodString>;
    filterByViewId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    visibleFieldIds: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("../../view/filter").IFilterSet, z.ZodTypeDef, import("../../view/filter").IFilterSet>>>;
}, "filter" | "baseId" | "foreignTableId" | "relationship" | "isOneWay" | "filterByViewId" | "visibleFieldIds"> & {
    lookupFieldId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    foreignTableId: string;
    relationship: Relationship;
    filter?: import("../../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
    lookupFieldId?: string | undefined;
    isOneWay?: boolean | undefined;
    filterByViewId?: string | null | undefined;
    visibleFieldIds?: string[] | null | undefined;
}, {
    foreignTableId: string;
    relationship: Relationship;
    filter?: import("../../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
    lookupFieldId?: string | undefined;
    isOneWay?: boolean | undefined;
    filterByViewId?: string | null | undefined;
    visibleFieldIds?: string[] | null | undefined;
}>;
export type ILinkFieldOptionsRo = z.infer<typeof linkFieldOptionsRoSchema>;
