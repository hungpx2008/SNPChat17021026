/// <reference types="react" />
import type { IFilterLinkProps, IFilterLinkSelectListProps } from './types';
interface FilterLinkSelectProps extends IFilterLinkProps {
    components?: {
        Trigger?: (props: IFilterLinkProps) => JSX.Element;
        List?: (value: IFilterLinkSelectListProps) => JSX.Element;
    };
    modal?: boolean;
}
export declare const FilterLinkSelect: (props: FilterLinkSelectProps) => import("react/jsx-runtime").JSX.Element;
export {};
