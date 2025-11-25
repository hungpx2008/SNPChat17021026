import { z } from '../../../zod';
import { CellValueType } from '../constant';
export * from './number';
export * from './datetime';
export * from './time-zone';
export declare const unionFormattingSchema: z.ZodUnion<[z.ZodObject<{
    date: z.ZodString;
    time: z.ZodNativeEnum<typeof import("./datetime").TimeFormatting>;
    timeZone: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    date: string;
    timeZone: string;
    time: import("./datetime").TimeFormatting;
}, {
    date: string;
    timeZone: string;
    time: import("./datetime").TimeFormatting;
}>, z.ZodUnion<[z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<import("./number").NumberFormattingType.Decimal>;
}, "strip", z.ZodTypeAny, {
    type: import("./number").NumberFormattingType.Decimal;
    precision: number;
}, {
    type: import("./number").NumberFormattingType.Decimal;
    precision: number;
}>, z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<import("./number").NumberFormattingType.Percent>;
}, "strip", z.ZodTypeAny, {
    type: import("./number").NumberFormattingType.Percent;
    precision: number;
}, {
    type: import("./number").NumberFormattingType.Percent;
    precision: number;
}>, z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<import("./number").NumberFormattingType.Currency>;
    symbol: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    type: import("./number").NumberFormattingType.Currency;
    precision: number;
}, {
    symbol: string;
    type: import("./number").NumberFormattingType.Currency;
    precision: number;
}>]>]>;
export type IUnionFormatting = z.infer<typeof unionFormattingSchema>;
export declare const getDefaultFormatting: (cellValueType: CellValueType) => {
    date: string;
    timeZone: string;
    time: import("./datetime").TimeFormatting;
} | {
    type: import("./number").NumberFormattingType.Decimal;
    precision: number;
} | {
    type: import("./number").NumberFormattingType.Percent;
    precision: number;
} | {
    symbol: string;
    type: import("./number").NumberFormattingType.Currency;
    precision: number;
} | undefined;
export declare const getFormattingSchema: (cellValueType: CellValueType) => z.ZodObject<{
    date: z.ZodString;
    time: z.ZodNativeEnum<typeof import("./datetime").TimeFormatting>;
    timeZone: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    date: string;
    timeZone: string;
    time: import("./datetime").TimeFormatting;
}, {
    date: string;
    timeZone: string;
    time: import("./datetime").TimeFormatting;
}> | z.ZodUnion<[z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<import("./number").NumberFormattingType.Decimal>;
}, "strip", z.ZodTypeAny, {
    type: import("./number").NumberFormattingType.Decimal;
    precision: number;
}, {
    type: import("./number").NumberFormattingType.Decimal;
    precision: number;
}>, z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<import("./number").NumberFormattingType.Percent>;
}, "strip", z.ZodTypeAny, {
    type: import("./number").NumberFormattingType.Percent;
    precision: number;
}, {
    type: import("./number").NumberFormattingType.Percent;
    precision: number;
}>, z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<import("./number").NumberFormattingType.Currency>;
    symbol: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    type: import("./number").NumberFormattingType.Currency;
    precision: number;
}, {
    symbol: string;
    type: import("./number").NumberFormattingType.Currency;
    precision: number;
}>]> | z.ZodUndefined;
