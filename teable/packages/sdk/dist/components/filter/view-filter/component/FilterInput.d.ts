import type { IFilterItem } from '@teable/core';
interface InputProps {
    value: IFilterItem['value'];
    onChange: (value: string | null) => void;
    placeholder: string;
    className?: string;
}
declare const FilterInput: (props: InputProps) => import("react/jsx-runtime").JSX.Element;
export { FilterInput };
