import { z } from 'zod';
import type { FieldType, CellValueType } from '../constant';
import { FieldCore } from '../field';
import type { IFieldVisitor } from '../field-visitor.interface';
import { TimeFormatting } from '../formatting';
import type { IDateFieldOptions } from './date-option.schema';
export declare const dataFieldCellValueSchema: z.ZodString;
export type IDateCellValue = z.infer<typeof dataFieldCellValueSchema>;
export declare class DateFieldCore extends FieldCore {
    type: FieldType.Date;
    options: IDateFieldOptions;
    meta?: undefined;
    cellValueType: CellValueType.DateTime;
    static defaultOptions(): IDateFieldOptions;
    cellValue2String(cellValue?: unknown): string;
    private defaultTzFormat;
    private parseUsingFieldFormatting;
    convertStringToCellValue(value: string): string | null;
    item2String(item?: unknown): string;
    repair(value: unknown): string | null;
    validateOptions(): z.SafeParseReturnType<{
        formatting: {
            date: string;
            timeZone: string;
            time: TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    }, {
        formatting: {
            date: string;
            timeZone: string;
            time: TimeFormatting;
        };
        defaultValue?: "now" | undefined;
    }>;
    validateCellValue(cellValue: unknown): z.SafeParseReturnType<[string, ...string[]] | null, [string, ...string[]] | null> | z.SafeParseReturnType<string | null, string | null>;
    validateCellValueLoose(cellValue: unknown): z.SafeParseReturnType<[string, ...string[]] | null, [string, ...string[]] | null> | z.SafeParseReturnType<string | null, string | null>;
    accept<T>(visitor: IFieldVisitor<T>): T;
}
