import type { IFilter } from '@teable/core';
import type { IFieldInstance } from '../../../model';
import type { IViewFilterLinkContext } from '../view-filter';
import type { IFilterReferenceSource } from '../view-filter/custom-component/BaseFieldValue';
interface IFilterWithTableProps {
    value: IFilter | null;
    fields: IFieldInstance[];
    context: IViewFilterLinkContext;
    onChange: (value: IFilter | null) => void;
    referenceSource?: IFilterReferenceSource;
}
export declare const FilterWithTable: (props: IFilterWithTableProps) => import("react/jsx-runtime").JSX.Element;
export {};
