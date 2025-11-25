import type { FieldType, CellValueType } from '../constant';
import type { IFieldVisitor } from '../field-visitor.interface';
import { FormulaAbstractCore } from './abstract/formula.field.abstract';
import type { IFormulaFieldMeta } from './formula-option.schema';
import type { ILastModifiedTimeFieldOptions, ILastModifiedTimeFieldOptionsRo } from './last-modified-time-option.schema';
export declare class LastModifiedTimeFieldCore extends FormulaAbstractCore {
    type: FieldType.LastModifiedTime;
    options: ILastModifiedTimeFieldOptions;
    meta?: IFormulaFieldMeta;
    cellValueType: CellValueType.DateTime;
    static defaultOptions(): ILastModifiedTimeFieldOptionsRo;
    validateOptions(): import("zod").SafeParseReturnType<{
        formatting: {
            date: string;
            timeZone: string;
            time: import("../formatting").TimeFormatting;
        };
    }, {
        formatting: {
            date: string;
            timeZone: string;
            time: import("../formatting").TimeFormatting;
        };
    }>;
    getExpression(): "LAST_MODIFIED_TIME()";
    accept<T>(visitor: IFieldVisitor<T>): T;
}
