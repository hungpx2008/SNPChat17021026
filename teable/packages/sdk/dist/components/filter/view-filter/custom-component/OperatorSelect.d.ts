import type { IFilterOperator, IFilterItem } from '@teable/core';
import type { IBaseFilterCustomComponentProps, IConditionItemProperty } from '../../types';
import type { IViewFilterConditionItem } from '../types';
interface IBaseOperatorSelectProps<T extends IConditionItemProperty = IViewFilterConditionItem> extends IBaseFilterCustomComponentProps<T, IFilterItem['operator']> {
    disabledOperators?: IFilterOperator[];
}
export declare const OperatorSelect: <T extends IConditionItemProperty = IViewFilterConditionItem>(props: IBaseOperatorSelectProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
