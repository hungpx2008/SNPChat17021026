import type { IFilterItem } from '@teable/core';
import type { IFieldInstance } from '../../../../model';
import type { ILinkContext } from '../component/filter-link/context';
import type { IFilterComponents } from '../types';
export interface IFilterReferenceSource {
    fields: IFieldInstance[];
    tableId?: string;
}
interface IBaseFieldValue {
    value: unknown;
    operator: IFilterItem['operator'];
    onSelect: (value: IFilterItem['value']) => void;
    field?: IFieldInstance;
    components?: IFilterComponents;
    linkContext?: ILinkContext;
    modal?: boolean;
    referenceSource?: IFilterReferenceSource;
}
export declare function BaseFieldValue(props: IBaseFieldValue): import("react/jsx-runtime").JSX.Element | null;
export {};
