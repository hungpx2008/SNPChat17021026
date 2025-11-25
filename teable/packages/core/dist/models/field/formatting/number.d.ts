import { z } from 'zod';
export declare enum NumberFormattingType {
    Decimal = "decimal",
    Percent = "percent",
    Currency = "currency"
}
export declare const decimalFormattingSchema: z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<NumberFormattingType.Decimal>;
}, "strip", z.ZodTypeAny, {
    type: NumberFormattingType.Decimal;
    precision: number;
}, {
    type: NumberFormattingType.Decimal;
    precision: number;
}>;
export declare const percentFormattingSchema: z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<NumberFormattingType.Percent>;
}, "strip", z.ZodTypeAny, {
    type: NumberFormattingType.Percent;
    precision: number;
}, {
    type: NumberFormattingType.Percent;
    precision: number;
}>;
export declare const currencyFormattingSchema: z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<NumberFormattingType.Currency>;
    symbol: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    type: NumberFormattingType.Currency;
    precision: number;
}, {
    symbol: string;
    type: NumberFormattingType.Currency;
    precision: number;
}>;
export declare const numberFormattingSchema: z.ZodUnion<[z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<NumberFormattingType.Decimal>;
}, "strip", z.ZodTypeAny, {
    type: NumberFormattingType.Decimal;
    precision: number;
}, {
    type: NumberFormattingType.Decimal;
    precision: number;
}>, z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<NumberFormattingType.Percent>;
}, "strip", z.ZodTypeAny, {
    type: NumberFormattingType.Percent;
    precision: number;
}, {
    type: NumberFormattingType.Percent;
    precision: number;
}>, z.ZodObject<{
    precision: z.ZodNumber;
} & {
    type: z.ZodLiteral<NumberFormattingType.Currency>;
    symbol: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    type: NumberFormattingType.Currency;
    precision: number;
}, {
    symbol: string;
    type: NumberFormattingType.Currency;
    precision: number;
}>]>;
export type IDecimalFormatting = z.infer<typeof decimalFormattingSchema>;
export type IPercentFormatting = z.infer<typeof percentFormattingSchema>;
export type ICurrencyFormatting = z.infer<typeof currencyFormattingSchema>;
export type INumberFormatting = z.infer<typeof numberFormattingSchema>;
export declare const defaultNumberFormatting: INumberFormatting;
export declare const formatNumberToString: (value: number | undefined, formatting: INumberFormatting) => string;
export declare const parseStringToNumber: (value: string | null, formatting?: INumberFormatting) => number | null;
