import type { IFilterPath, IBaseFilterItem, IBaseConditionProps } from '../types';
interface IConditionProps extends IBaseConditionProps {
    path: IFilterPath;
    value: IBaseFilterItem;
    conjunction: 'or' | 'and';
}
export declare const Condition: (props: IConditionProps) => import("react/jsx-runtime").JSX.Element;
export {};
