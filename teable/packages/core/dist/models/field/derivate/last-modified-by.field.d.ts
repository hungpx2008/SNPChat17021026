import type { FieldType } from '../constant';
import type { IFieldVisitor } from '../field-visitor.interface';
import { UserAbstractCore } from './abstract/user.field.abstract';
import type { IFormulaFieldMeta } from './formula-option.schema';
import type { ILastModifiedByFieldOptions } from './last-modified-by-option.schema';
export declare class LastModifiedByFieldCore extends UserAbstractCore {
    type: FieldType.LastModifiedBy;
    options: ILastModifiedByFieldOptions;
    meta?: IFormulaFieldMeta;
    get isStructuredCellValue(): boolean;
    convertStringToCellValue(_value: string): null;
    repair(_value: unknown): null;
    validateOptions(): import("zod").SafeParseReturnType<{}, {}>;
    accept<T>(visitor: IFieldVisitor<T>): T;
}
