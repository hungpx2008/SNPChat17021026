import { z } from '../../../zod';
import { SortFunc } from '../../view/sort';
export declare const conditionalRollupFieldOptionsSchema: z.ZodObject<{
    expression: z.ZodEnum<["countall({values})", "counta({values})", "count({values})", "sum({values})", "average({values})", "max({values})", "min({values})", "and({values})", "or({values})", "xor({values})", "array_join({values})", "array_unique({values})", "array_compact({values})", "concatenate({values})"]>;
    timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        date: z.ZodString;
        time: z.ZodNativeEnum<typeof import("..").TimeFormatting>;
        timeZone: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        timeZone: string;
        time: import("..").TimeFormatting;
    }, {
        date: string;
        timeZone: string;
        time: import("..").TimeFormatting;
    }>, z.ZodUnion<[z.ZodObject<{
        precision: z.ZodNumber;
    } & {
        type: z.ZodLiteral<import("..").NumberFormattingType.Decimal>;
    }, "strip", z.ZodTypeAny, {
        type: import("..").NumberFormattingType.Decimal;
        precision: number;
    }, {
        type: import("..").NumberFormattingType.Decimal;
        precision: number;
    }>, z.ZodObject<{
        precision: z.ZodNumber;
    } & {
        type: z.ZodLiteral<import("..").NumberFormattingType.Percent>;
    }, "strip", z.ZodTypeAny, {
        type: import("..").NumberFormattingType.Percent;
        precision: number;
    }, {
        type: import("..").NumberFormattingType.Percent;
        precision: number;
    }>, z.ZodObject<{
        precision: z.ZodNumber;
    } & {
        type: z.ZodLiteral<import("..").NumberFormattingType.Currency>;
        symbol: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        type: import("..").NumberFormattingType.Currency;
        precision: number;
    }, {
        symbol: string;
        type: import("..").NumberFormattingType.Currency;
        precision: number;
    }>]>]>>;
    showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        type: z.ZodNativeEnum<typeof import("..").SingleLineTextDisplayType>;
    }, "strict", z.ZodTypeAny, {
        type: import("..").SingleLineTextDisplayType;
    }, {
        type: import("..").SingleLineTextDisplayType;
    }>, z.ZodUnion<[z.ZodObject<{
        type: z.ZodNativeEnum<typeof import("..").SingleNumberDisplayType>;
        color: z.ZodNativeEnum<typeof import("..").Colors>;
        showValue: z.ZodBoolean;
        maxValue: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        type: import("..").SingleNumberDisplayType;
        color: import("..").Colors;
        showValue: boolean;
        maxValue: number;
    }, {
        type: import("..").SingleNumberDisplayType;
        color: import("..").Colors;
        showValue: boolean;
        maxValue: number;
    }>, z.ZodObject<{
        type: z.ZodNativeEnum<typeof import("..").MultiNumberDisplayType>;
        color: z.ZodNativeEnum<typeof import("..").Colors>;
    }, "strict", z.ZodTypeAny, {
        type: import("..").MultiNumberDisplayType;
        color: import("..").Colors;
    }, {
        type: import("..").MultiNumberDisplayType;
        color: import("..").Colors;
    }>]>]>>;
} & {
    baseId: z.ZodOptional<z.ZodString>;
    foreignTableId: z.ZodOptional<z.ZodString>;
    lookupFieldId: z.ZodOptional<z.ZodString>;
    filter: z.ZodOptional<z.ZodNullable<z.ZodType<import("../../view/filter").IFilterSet, z.ZodTypeDef, import("../../view/filter").IFilterSet>>>;
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
    expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
    filter?: import("../../view/filter").IFilterSet | null | undefined;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    timeZone?: string | undefined;
    formatting?: {
        date: string;
        timeZone: string;
        time: import("..").TimeFormatting;
    } | {
        type: import("..").NumberFormattingType.Decimal;
        precision: number;
    } | {
        type: import("..").NumberFormattingType.Percent;
        precision: number;
    } | {
        symbol: string;
        type: import("..").NumberFormattingType.Currency;
        precision: number;
    } | undefined;
    showAs?: {
        type: import("..").SingleLineTextDisplayType;
    } | {
        type: import("..").SingleNumberDisplayType;
        color: import("..").Colors;
        showValue: boolean;
        maxValue: number;
    } | {
        type: import("..").MultiNumberDisplayType;
        color: import("..").Colors;
    } | undefined;
    baseId?: string | undefined;
    foreignTableId?: string | undefined;
    lookupFieldId?: string | undefined;
    limit?: number | undefined;
}, {
    expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
    filter?: import("../../view/filter").IFilterSet | null | undefined;
    sort?: {
        fieldId: string;
        order: SortFunc;
    } | undefined;
    timeZone?: string | undefined;
    formatting?: {
        date: string;
        timeZone: string;
        time: import("..").TimeFormatting;
    } | {
        type: import("..").NumberFormattingType.Decimal;
        precision: number;
    } | {
        type: import("..").NumberFormattingType.Percent;
        precision: number;
    } | {
        symbol: string;
        type: import("..").NumberFormattingType.Currency;
        precision: number;
    } | undefined;
    showAs?: {
        type: import("..").SingleLineTextDisplayType;
    } | {
        type: import("..").SingleNumberDisplayType;
        color: import("..").Colors;
        showValue: boolean;
        maxValue: number;
    } | {
        type: import("..").MultiNumberDisplayType;
        color: import("..").Colors;
    } | undefined;
    baseId?: string | undefined;
    foreignTableId?: string | undefined;
    lookupFieldId?: string | undefined;
    limit?: number | undefined;
}>;
export type IConditionalRollupFieldOptions = z.infer<typeof conditionalRollupFieldOptionsSchema>;
