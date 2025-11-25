import { z } from 'zod';
import { Colors } from '../colors';
import type { CellValueType, FieldType } from '../constant';
import { FieldCore } from '../field';
import type { IFieldVisitor } from '../field-visitor.interface';
import type { IRatingFieldOptions } from './rating-option.schema';
import { RatingIcon } from './rating-option.schema';
export declare class RatingFieldCore extends FieldCore {
    type: FieldType.Rating;
    options: IRatingFieldOptions;
    meta?: undefined;
    cellValueType: CellValueType.Number;
    static defaultOptions(): IRatingFieldOptions;
    cellValue2String(cellValue?: unknown): string;
    item2String(value?: unknown): string;
    convertStringToCellValue(value: string): number | null;
    repair(value: unknown): number | null;
    validateOptions(): z.SafeParseReturnType<{
        max: number;
        color: Colors.RedBright | Colors.TealBright | Colors.YellowBright;
        icon: RatingIcon;
    }, {
        max: number;
        color: Colors.RedBright | Colors.TealBright | Colors.YellowBright;
        icon: RatingIcon;
    }>;
    validateCellValue(value: unknown): z.SafeParseReturnType<number | null, number | null> | z.SafeParseReturnType<[number, ...number[]] | null, [number, ...number[]] | null>;
    accept<T>(visitor: IFieldVisitor<T>): T;
}
