import { z } from 'zod';
import type { CellValueType, FieldType } from '../constant';
import { FieldCore } from '../field';
import type { IFieldVisitor } from '../field-visitor.interface';
import { type ILongTextFieldOptions } from './long-text-option.schema';
export declare const longTextCelValueSchema: z.ZodString;
export type ILongTextCellValue = z.infer<typeof longTextCelValueSchema>;
export declare class LongTextFieldCore extends FieldCore {
    type: FieldType.LongText;
    options: ILongTextFieldOptions;
    meta?: undefined;
    cellValueType: CellValueType.String;
    static defaultOptions(): ILongTextFieldOptions;
    cellValue2String(cellValue?: unknown): string;
    item2String(value?: unknown): string;
    convertStringToCellValue(value: string): string | null;
    repair(value: unknown): string | null;
    validateOptions(): z.SafeParseReturnType<{
        defaultValue?: string | undefined;
    }, {
        defaultValue?: string | undefined;
    }>;
    validateCellValue(value: unknown): z.SafeParseReturnType<[string, ...string[]] | null, [string, ...string[]] | null> | z.SafeParseReturnType<string | null, string | null>;
    accept<T>(visitor: IFieldVisitor<T>): T;
}
