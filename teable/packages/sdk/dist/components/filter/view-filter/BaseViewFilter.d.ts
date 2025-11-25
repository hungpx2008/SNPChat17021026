import type { IFilter } from '@teable/core';
import type { IFieldInstance } from '../../../model';
import type { IFilterBaseComponent, IConditionItemProperty } from '../types';
import type { IViewFilterConditionItem, IViewFilterLinkContext } from './types';
interface IViewFilterProps<T extends IConditionItemProperty = IViewFilterConditionItem> {
    value: IFilter;
    fields: IFieldInstance[];
    onChange: (value: IFilter) => void;
    /**
     * why there is required instead of optional?
     * 1. in this view filter, link is required
     * 2. this context is for selected link item title display
     * 3. it's better to not set default context, because of when this component is used in other unknown place may cause unexpected behavior
     */
    viewFilterLinkContext: IViewFilterLinkContext;
    customValueComponent?: IFilterBaseComponent<T> & {
        modal?: boolean;
    };
    operatorSelect?: IFilterBaseComponent<T>;
}
export declare const BaseViewFilter: <T extends IConditionItemProperty = IViewFilterConditionItem>(props: IViewFilterProps<T> & {
    modal?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export {};
