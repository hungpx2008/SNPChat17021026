import type { FieldType } from '../constant';
import type { IFieldVisitor } from '../field-visitor.interface';
import { UserAbstractCore } from './abstract/user.field.abstract';
import { type ICreatedByFieldOptions } from './created-by-option.schema';
import type { IFormulaFieldMeta } from './formula-option.schema';
export declare class CreatedByFieldCore extends UserAbstractCore {
    type: FieldType.CreatedBy;
    options: ICreatedByFieldOptions;
    meta?: IFormulaFieldMeta;
    get isStructuredCellValue(): boolean;
    convertStringToCellValue(_value: string): null;
    repair(_value: unknown): null;
    validateOptions(): import("zod").SafeParseReturnType<{}, {}>;
    accept<T>(visitor: IFieldVisitor<T>): T;
}
