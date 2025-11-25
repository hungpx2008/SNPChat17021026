import type { IFilter } from '../../view/filter';
import type { CellValueType, FieldType } from '../constant';
import type { IFieldVisitor } from '../field-visitor.interface';
import { FormulaAbstractCore } from './abstract/formula.field.abstract';
import { type IConditionalRollupFieldOptions } from './conditional-rollup-option.schema';
export declare class ConditionalRollupFieldCore extends FormulaAbstractCore {
    static defaultOptions(cellValueType: CellValueType): Partial<IConditionalRollupFieldOptions>;
    static getParsedValueType(expression: string, cellValueType: CellValueType, isMultipleCellValue: boolean): {
        cellValueType: CellValueType;
        isMultipleCellValue: boolean | undefined;
    };
    type: FieldType.ConditionalRollup;
    options: IConditionalRollupFieldOptions;
    meta?: undefined;
    getFilter(): IFilter | undefined;
    static supportsOrdering(expression?: string): boolean;
    validateOptions(): import("zod").SafeParseReturnType<{
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("../../view/filter").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("../..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("../formatting").TimeFormatting;
        } | {
            type: import("../formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("../formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("../formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
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
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }, {
        expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "average({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
        filter?: import("../../view/filter").IFilterSet | null | undefined;
        sort?: {
            fieldId: string;
            order: import("../..").SortFunc;
        } | undefined;
        timeZone?: string | undefined;
        formatting?: {
            date: string;
            timeZone: string;
            time: import("../formatting").TimeFormatting;
        } | {
            type: import("../formatting").NumberFormattingType.Decimal;
            precision: number;
        } | {
            type: import("../formatting").NumberFormattingType.Percent;
            precision: number;
        } | {
            symbol: string;
            type: import("../formatting").NumberFormattingType.Currency;
            precision: number;
        } | undefined;
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
        baseId?: string | undefined;
        foreignTableId?: string | undefined;
        lookupFieldId?: string | undefined;
        limit?: number | undefined;
    }>;
    getForeignTableId(): string | undefined;
    accept<T>(visitor: IFieldVisitor<T>): T;
}
