import { z } from 'zod';
import type { RootContext } from '../../../../formula/parser/Formula';
import type { IRecord } from '../../../record';
import { CellValueType } from '../../constant';
import { FieldCore } from '../../field';
import type { IUnionFormatting } from '../../formatting';
export declare const getFormulaCellValueSchema: (cellValueType: CellValueType) => z.ZodString | z.ZodNumber | z.ZodBoolean;
export declare abstract class FormulaAbstractCore extends FieldCore {
    static parse(expression: string): RootContext;
    options: {
        expression: string;
        formatting?: IUnionFormatting;
    };
    cellValueType: CellValueType;
    isMultipleCellValue?: boolean | undefined;
    protected _tree?: RootContext;
    protected get tree(): RootContext;
    evaluate(dependFieldMap: {
        [fieldId: string]: FieldCore;
    }, record: IRecord): import("../../../..").TypedValue<any>;
    cellValue2String(cellValue?: unknown): string;
    convertStringToCellValue(_value: string): null;
    item2String(value?: unknown): string;
    repair(_value: unknown): null;
    validateCellValue(value: unknown): z.SafeParseError<boolean | null> | z.SafeParseSuccess<string | null> | z.SafeParseReturnType<(string | number | boolean)[] | null, (string | number | boolean)[] | null> | z.SafeParseSuccess<number | null> | z.SafeParseSuccess<boolean | null>;
}
