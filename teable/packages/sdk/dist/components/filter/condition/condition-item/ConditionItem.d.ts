import type { IConditionItemProperty, IBaseConditionProps, IBaseFilterComponentProps } from '../../types';
interface IConditionItemProps<T extends IConditionItemProperty = IConditionItemProperty> extends IBaseConditionProps, IBaseFilterComponentProps {
    value: T;
}
export declare const ConditionItem: <T extends IConditionItemProperty>(props: IConditionItemProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
