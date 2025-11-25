import type { FieldType, CellValueType } from '../constant';
import type { IFieldVisitor } from '../field-visitor.interface';
import { FormulaAbstractCore } from './abstract/formula.field.abstract';
import { type ICreatedTimeFieldOptions, type ICreatedTimeFieldOptionsRo } from './created-time-option.schema';
import type { IFormulaFieldMeta } from './formula-option.schema';
export declare class CreatedTimeFieldCore extends FormulaAbstractCore {
    type: FieldType.CreatedTime;
    options: ICreatedTimeFieldOptions;
    meta?: IFormulaFieldMeta;
    cellValueType: CellValueType.DateTime;
    getExpression(): "CREATED_TIME()";
    static defaultOptions(): ICreatedTimeFieldOptionsRo;
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
    accept<T>(visitor: IFieldVisitor<T>): T;
}
