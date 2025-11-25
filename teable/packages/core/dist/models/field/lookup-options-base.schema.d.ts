import { z } from '../../zod';
import { SortFunc } from '../view/sort';
import { Relationship } from './constant';
declare const lookupLinkOptionsVoSchema: z.ZodObject<{
    baseId: z.ZodOptional<z.ZodString>;
    relationship: z.ZodNativeEnum<typeof Relationship>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    fkHostTableName: z.ZodString;
    selfKeyName: z.ZodString;
    foreignKeyName: z.ZodString;
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("../view/filter").IFilterSet, z.ZodTypeDef, import("../view/filter").IFilterSet>>>;
    linkFieldId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    foreignTableId: string;
    lookupFieldId: string;
    relationship: Relationship;
    fkHostTableName: string;
    selfKeyName: string;
    foreignKeyName: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
}, {
    foreignTableId: string;
    lookupFieldId: string;
    relationship: Relationship;
    fkHostTableName: string;
    selfKeyName: string;
    foreignKeyName: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
}>;
declare const lookupLinkOptionsRoSchema: z.ZodObject<Pick<{
    baseId: z.ZodOptional<z.ZodString>;
    relationship: z.ZodNativeEnum<typeof Relationship>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    fkHostTableName: z.ZodString;
    selfKeyName: z.ZodString;
    foreignKeyName: z.ZodString;
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("../view/filter").IFilterSet, z.ZodTypeDef, import("../view/filter").IFilterSet>>>;
    linkFieldId: z.ZodString;
}, "filter" | "foreignTableId" | "lookupFieldId" | "linkFieldId">, "strip", z.ZodTypeAny, {
    foreignTableId: string;
    lookupFieldId: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
}, {
    foreignTableId: string;
    lookupFieldId: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
}>;
declare const lookupConditionalOptionsVoSchema: z.ZodObject<{
    baseId: z.ZodOptional<z.ZodString>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    filter: z.ZodNullable<z.ZodType<import("../view/filter").IFilterSet, z.ZodTypeDef, import("../view/filter").IFilterSet>>;
    sort: z.ZodOptional<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: SortFunc;
    }, {
        fieldId: string;
        order: SortFunc;
    }>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
}, {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
}>;
declare const lookupConditionalOptionsRoSchema: z.ZodObject<{
    baseId: z.ZodOptional<z.ZodString>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    filter: z.ZodNullable<z.ZodType<import("../view/filter").IFilterSet, z.ZodTypeDef, import("../view/filter").IFilterSet>>;
    sort: z.ZodOptional<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: SortFunc;
    }, {
        fieldId: string;
        order: SortFunc;
    }>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
}, {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
}>;
export declare const lookupOptionsVoSchema: z.ZodUnion<[z.ZodObject<{
    baseId: z.ZodOptional<z.ZodString>;
    relationship: z.ZodNativeEnum<typeof Relationship>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    fkHostTableName: z.ZodString;
    selfKeyName: z.ZodString;
    foreignKeyName: z.ZodString;
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("../view/filter").IFilterSet, z.ZodTypeDef, import("../view/filter").IFilterSet>>>;
    linkFieldId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    foreignTableId: string;
    lookupFieldId: string;
    relationship: Relationship;
    fkHostTableName: string;
    selfKeyName: string;
    foreignKeyName: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
}, {
    foreignTableId: string;
    lookupFieldId: string;
    relationship: Relationship;
    fkHostTableName: string;
    selfKeyName: string;
    foreignKeyName: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
}>, z.ZodObject<{
    baseId: z.ZodOptional<z.ZodString>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    filter: z.ZodNullable<z.ZodType<import("../view/filter").IFilterSet, z.ZodTypeDef, import("../view/filter").IFilterSet>>;
    sort: z.ZodOptional<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: SortFunc;
    }, {
        fieldId: string;
        order: SortFunc;
    }>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
}, {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
}>]>;
export declare const lookupOptionsRoSchema: z.ZodUnion<[z.ZodObject<Pick<{
    baseId: z.ZodOptional<z.ZodString>;
    relationship: z.ZodNativeEnum<typeof Relationship>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    fkHostTableName: z.ZodString;
    selfKeyName: z.ZodString;
    foreignKeyName: z.ZodString;
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("../view/filter").IFilterSet, z.ZodTypeDef, import("../view/filter").IFilterSet>>>;
    linkFieldId: z.ZodString;
}, "filter" | "foreignTableId" | "lookupFieldId" | "linkFieldId">, "strict", z.ZodTypeAny, {
    foreignTableId: string;
    lookupFieldId: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
}, {
    foreignTableId: string;
    lookupFieldId: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
}>, z.ZodObject<{
    baseId: z.ZodOptional<z.ZodString>;
    foreignTableId: z.ZodString;
    lookupFieldId: z.ZodString;
    filter: z.ZodNullable<z.ZodType<import("../view/filter").IFilterSet, z.ZodTypeDef, import("../view/filter").IFilterSet>>;
    sort: z.ZodOptional<z.ZodObject<{
        fieldId: z.ZodString;
        order: z.ZodNativeEnum<typeof SortFunc>;
    }, "strip", z.ZodTypeAny, {
        fieldId: string;
        order: SortFunc;
    }, {
        fieldId: string;
        order: SortFunc;
    }>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
}, {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
}>]>;
export type ILookupOptionsVo = z.infer<typeof lookupOptionsVoSchema>;
export type ILookupOptionsRo = z.infer<typeof lookupOptionsRoSchema>;
export type ILookupLinkOptions = z.infer<typeof lookupLinkOptionsRoSchema>;
export type ILookupConditionalOptions = z.infer<typeof lookupConditionalOptionsRoSchema>;
export type IConditionalLookupOptions = ILookupConditionalOptions;
export type ILookupLinkOptionsVo = z.infer<typeof lookupLinkOptionsVoSchema>;
export type ILookupConditionalOptionsVo = z.infer<typeof lookupConditionalOptionsVoSchema>;
export declare const isLinkLookupOptions: <T extends {
    foreignTableId: string;
    lookupFieldId: string;
    relationship: Relationship;
    fkHostTableName: string;
    selfKeyName: string;
    foreignKeyName: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
} | {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
} | {
    foreignTableId: string;
    lookupFieldId: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
} | undefined>(options: T) => options is Extract<T, {
    foreignTableId: string;
    lookupFieldId: string;
    relationship: Relationship;
    fkHostTableName: string;
    selfKeyName: string;
    foreignKeyName: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
    baseId?: string | undefined;
} | {
    foreignTableId: string;
    lookupFieldId: string;
    linkFieldId: string;
    filter?: import("../view/filter").IFilterSet | null | undefined;
}>;
export declare const isConditionalLookupOptions: (options: ILookupOptionsRo | ILookupOptionsVo | undefined) => options is {
    filter: import("../view/filter").IFilterSet | null;
    foreignTableId: string;
    lookupFieldId: string;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    baseId?: string | undefined;
    limit?: number | undefined;
};
export {};
