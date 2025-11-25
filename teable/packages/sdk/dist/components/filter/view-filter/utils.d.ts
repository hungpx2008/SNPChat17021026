import type { IFilter } from '@teable/core';
import { CellValueType, FieldType } from '@teable/core';
import type { IFieldInstance } from '../../../model';
import type { IConditionItemProperty } from '../types';
import type { IViewFilterConditionItem, IBaseViewFilter } from './types';
export declare const viewFilter2BaseFilter: <T extends IConditionItemProperty = IViewFilterConditionItem>(viewFilter: IFilter) => IBaseViewFilter<T>;
export declare const baseFilter2ViewFilter: <T extends IConditionItemProperty = IViewFilterConditionItem>(baseFilter: IBaseViewFilter<T>) => IFilter;
/**
 * 1. when the operator type change to empty, the value should be null
 * 2. when the operator type change and the cellValueType changed, the value should be null
 */
export declare const shouldResetFieldValue: (newOperator: string, oldOperator: string) => boolean;
export declare const shouldFilterByDefaultValue: (field: {
    type: FieldType;
    cellValueType: CellValueType;
} | undefined) => boolean;
export declare const getFilterFieldIds: (filter: NonNullable<IFilter>['filterSet'], fieldMap: Record<string, IFieldInstance>) => Set<string>;
