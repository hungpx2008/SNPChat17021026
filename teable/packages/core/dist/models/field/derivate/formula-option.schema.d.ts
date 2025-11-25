import { z } from '../../../zod';
export declare const formulaFieldOptionsSchema: z.ZodObject<{
    expression: z.ZodString;
    timeZone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    formatting: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        date: z.ZodString;
        time: z.ZodNativeEnum<typeof import("../formatting").TimeFormatting>;
        timeZone: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    }, {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    }>, z.ZodUnion<[z.ZodObject<{
        precision: z.ZodNumber;
    } & {
        type: z.ZodLiteral<import("../formatting").NumberFormattingType.Decimal>;
    }, "strip", z.ZodTypeAny, {
        type: import("../formatting").NumberFormattingType.Decimal;
        precision: number;
    }, {
        type: import("../formatting").NumberFormattingType.Decimal;
        precision: number;
    }>, z.ZodObject<{
        precision: z.ZodNumber;
    } & {
        type: z.ZodLiteral<import("../formatting").NumberFormattingType.Percent>;
    }, "strip", z.ZodTypeAny, {
        type: import("../formatting").NumberFormattingType.Percent;
        precision: number;
    }, {
        type: import("../formatting").NumberFormattingType.Percent;
        precision: number;
    }>, z.ZodObject<{
        precision: z.ZodNumber;
    } & {
        type: z.ZodLiteral<import("../formatting").NumberFormattingType.Currency>;
        symbol: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        type: import("../formatting").NumberFormattingType.Currency;
        precision: number;
    }, {
        symbol: string;
        type: import("../formatting").NumberFormattingType.Currency;
        precision: number;
    }>]>]>>;
    showAs: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        type: z.ZodNativeEnum<typeof import("../show-as").SingleLineTextDisplayType>;
    }, "strict", z.ZodTypeAny, {
        type: import("../show-as").SingleLineTextDisplayType;
    }, {
        type: import("../show-as").SingleLineTextDisplayType;
    }>, z.ZodUnion<[z.ZodObject<{
        type: z.ZodNativeEnum<typeof import("../show-as").SingleNumberDisplayType>;
        color: z.ZodNativeEnum<typeof import("..").Colors>;
        showValue: z.ZodBoolean;
        maxValue: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        type: import("../show-as").SingleNumberDisplayType;
        color: import("..").Colors;
        showValue: boolean;
        maxValue: number;
    }, {
        type: import("../show-as").SingleNumberDisplayType;
        color: import("..").Colors;
        showValue: boolean;
        maxValue: number;
    }>, z.ZodObject<{
        type: z.ZodNativeEnum<typeof import("../show-as").MultiNumberDisplayType>;
        color: z.ZodNativeEnum<typeof import("..").Colors>;
    }, "strict", z.ZodTypeAny, {
        type: import("../show-as").MultiNumberDisplayType;
        color: import("..").Colors;
    }, {
        type: import("../show-as").MultiNumberDisplayType;
        color: import("..").Colors;
    }>]>]>>;
}, "strip", z.ZodTypeAny, {
    expression: string;
    timeZone?: string | undefined;
    formatting?: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    } | {
        type: import("../formatting").NumberFormattingType.Decimal;
        precision: number;
    } | {
        type: import("../formatting").NumberFormattingType.Percent;
        precision: number;
    } | {
        symbol: string;
        type: import("../formatting").NumberFormattingType.Currency;
        precision: number;
    } | undefined;
    showAs?: {
        type: import("../show-as").SingleLineTextDisplayType;
    } | {
        type: import("../show-as").SingleNumberDisplayType;
        color: import("..").Colors;
        showValue: boolean;
        maxValue: number;
    } | {
        type: import("../show-as").MultiNumberDisplayType;
        color: import("..").Colors;
    } | undefined;
}, {
    expression: string;
    timeZone?: string | undefined;
    formatting?: {
        date: string;
        timeZone: string;
        time: import("../formatting").TimeFormatting;
    } | {
        type: import("../formatting").NumberFormattingType.Decimal;
        precision: number;
    } | {
        type: import("../formatting").NumberFormattingType.Percent;
        precision: number;
    } | {
        symbol: string;
        type: import("../formatting").NumberFormattingType.Currency;
        precision: number;
    } | undefined;
    showAs?: {
        type: import("../show-as").SingleLineTextDisplayType;
    } | {
        type: import("../show-as").SingleNumberDisplayType;
        color: import("..").Colors;
        showValue: boolean;
        maxValue: number;
    } | {
        type: import("../show-as").MultiNumberDisplayType;
        color: import("..").Colors;
    } | undefined;
}>;
export type IFormulaFieldOptions = z.infer<typeof formulaFieldOptionsSchema>;
export declare const formulaFieldMetaSchema: z.ZodObject<{
    persistedAsGeneratedColumn: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    persistedAsGeneratedColumn: boolean;
}, {
    persistedAsGeneratedColumn?: boolean | undefined;
}>;
export type IFormulaFieldMeta = z.infer<typeof formulaFieldMetaSchema>;
