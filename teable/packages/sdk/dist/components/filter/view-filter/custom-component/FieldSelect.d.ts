import type { IBaseFilterCustomComponentProps, IConditionItemProperty } from '../../types';
import type { IViewFilterConditionItem } from '../types';
interface IFieldSelectProps<T extends IConditionItemProperty = IViewFilterConditionItem> extends IBaseFilterCustomComponentProps<T, string | null> {
}
export declare const FieldSelect: <T extends IConditionItemProperty = IViewFilterConditionItem>(props: IFieldSelectProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
