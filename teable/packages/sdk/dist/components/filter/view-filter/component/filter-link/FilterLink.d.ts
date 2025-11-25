import { FilterLinkInput } from './FilterLinkInput';
import { FilterLinkSelect } from './FilterLinkSelect';
import type { IFilterLinkProps } from './types';
/**
 * why use props emit filter link context
 * just for reuse this component in other place, making it more flexible
 */
export declare const FilterLink: (props: IFilterLinkProps) => import("react/jsx-runtime").JSX.Element;
interface IFilterLinkBaseProps extends IFilterLinkProps {
    components?: {
        Input?: typeof FilterLinkInput;
        Select?: typeof FilterLinkSelect;
    };
}
export declare const FilterLinkBase: (props: IFilterLinkBaseProps) => import("react/jsx-runtime").JSX.Element;
export {};
