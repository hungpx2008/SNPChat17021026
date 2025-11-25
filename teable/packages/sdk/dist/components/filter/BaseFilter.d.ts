import type { IConditionItem, IConditionGroup, IBaseFilterValue, IFilterBaseComponent, IConditionItemProperty, IComponentWithChildren } from './types';
export interface IBaseFilterProps<T extends IConditionItemProperty = IConditionItemProperty> {
    maxDepth?: number;
    value?: IBaseFilterValue<T>;
    defaultValue?: IBaseFilterValue<T>;
    defaultItemValue?: IConditionItem<T>;
    defaultGroupValue?: IConditionGroup<T>;
    onChange: (value: IBaseFilterValue<T>) => void;
    components: {
        FieldComponent: IFilterBaseComponent<T>;
        OperatorComponent: IFilterBaseComponent<T>;
        ValueComponent: IFilterBaseComponent<T>;
    };
    footerClassName?: string;
    contentClassName?: string;
}
export declare const BaseFilter: <T extends IConditionItemProperty>(props: IBaseFilterProps<T>) => import("react/jsx-runtime").JSX.Element;
export declare const BaseFilterFooter: (props: IComponentWithChildren) => import("react/jsx-runtime").JSX.Element;
