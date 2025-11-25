import React from 'react';
import type { IFilterBaseComponent, IFilterPath, IBaseFilterValue, IConditionItemProperty } from './types';
export interface IBaseFilterContext<T extends IConditionItemProperty = IConditionItemProperty> {
    maxDepth?: number;
    getValue: () => IBaseFilterValue;
    onDelete: (path: IFilterPath, index: number) => void;
    onChange: (path: IFilterPath, value: unknown) => void;
    createCondition: (path: IFilterPath, index: 'item' | 'group') => void;
    component: {
        FieldComponent: IFilterBaseComponent<T>;
        OperatorComponent: IFilterBaseComponent<T>;
        ValueComponent: IFilterBaseComponent<T>;
    };
}
export declare const BaseFilterContext: React.Context<IBaseFilterContext<any>>;
