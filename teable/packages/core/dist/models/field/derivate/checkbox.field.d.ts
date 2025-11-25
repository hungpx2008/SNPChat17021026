import { z } from 'zod';
import type { FieldType, CellValueType } from '../constant';
import { FieldCore } from '../field';
import type { IFieldVisitor } from '../field-visitor.interface';
import type { ICheckboxFieldOptions } from './checkbox-option.schema';
export declare const booleanCellValueSchema: z.ZodBoolean;
export type ICheckboxCellValue = z.infer<typeof booleanCellValueSchema>;
export declare class CheckboxFieldCore extends FieldCore {
    type: FieldType.Checkbox;
    options: ICheckboxFieldOptions;
    meta?: undefined;
    cellValueType: CellValueType.Boolean;
    static defaultOptions(): ICheckboxFieldOptions;
    cellValue2String(cellValue?: unknown): string;
    convertStringToCellValue(value: string): boolean | null;
    repair(value: unknown): true | null;
    item2String(item?: unknown): "" | "true";
    validateOptions(): z.SafeParseReturnType<{
        defaultValue?: boolean | undefined;
    }, {
        defaultValue?: boolean | undefined;
    }>;
    validateCellValue(value: unknown): z.SafeParseReturnType<[true, ...true[]] | null, [true, ...true[]] | null> | z.SafeParseReturnType<boolean | null, true | null>;
    accept<T>(visitor: IFieldVisitor<T>): T;
}
