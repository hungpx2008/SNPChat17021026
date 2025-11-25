/// <reference types="react" />
import { type IFilter } from '@teable/core';
import type { IFilterBaseComponent } from '../types';
import type { IViewFilterConditionItem, IViewFilterLinkContext } from './types';
export interface IViewFilterProps {
    filters: IFilter;
    contentHeader?: React.ReactNode;
    onChange: (value: IFilter) => void;
    viewFilterLinkContext?: IViewFilterLinkContext;
    children?: (text: string, isActive?: boolean) => React.ReactNode;
    customValueComponent?: IFilterBaseComponent<IViewFilterConditionItem>;
}
export declare const ViewFilter: (props: IViewFilterProps) => import("react/jsx-runtime").JSX.Element;
