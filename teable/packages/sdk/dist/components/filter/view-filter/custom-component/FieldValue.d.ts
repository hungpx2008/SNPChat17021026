import type { IFilterComponents } from '../../index';
import type { IBaseFilterCustomComponentProps, IConditionItemProperty } from '../../types';
import type { IViewFilterConditionItem } from '../types';
import type { IFilterReferenceSource } from './BaseFieldValue';
interface IFieldValue<T extends IConditionItemProperty = IViewFilterConditionItem> extends IBaseFilterCustomComponentProps<T, T['value']> {
    components?: IFilterComponents;
    referenceSource?: IFilterReferenceSource;
}
export declare const FieldValue: <T extends IConditionItemProperty = IViewFilterConditionItem>(props: IFieldValue<T>) => import("react/jsx-runtime").JSX.Element;
export {};
