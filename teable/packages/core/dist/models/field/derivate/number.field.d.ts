import { z } from 'zod';
import type { FieldType, CellValueType } from '../constant';
import { FieldCore } from '../field';
import type { IFieldVisitor } from '../field-visitor.interface';
import { type INumberFieldOptions } from './number-option.schema';
export declare const numberCellValueSchema: z.ZodNumber;
export type INumberCellValue = z.infer<typeof numberCellValueSchema>;
export declare class NumberFieldCore extends FieldCore {
    type: FieldType.Number;
    options: INumberFieldOptions;
    meta?: undefined;
    cellValueType: CellValueType.Number;
    static defaultOptions(): INumberFieldOptions;
    cellValue2String(cellValue?: unknown): string;
    item2String(value?: unknown): string;
    convertStringToCellValue(value: string): number | null;
    repair(value: unknown): number | null;
    validateOptions(): z.SafeParseReturnType<{
        formatting: {
            type: import("../formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("../formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("../formatting").NumberFormattingType.Currency;
            precision: number;
        };
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
        formatting: {
            type: import("../formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("../formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("../formatting").NumberFormattingType.Currency;
            precision: number;
        };
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
    validateCellValue(value: unknown): z.SafeParseReturnType<number | null, number | null> | z.SafeParseReturnType<[number, ...number[]] | null, [number, ...number[]] | null>;
    accept<T>(visitor: IFieldVisitor<T>): T;
}
