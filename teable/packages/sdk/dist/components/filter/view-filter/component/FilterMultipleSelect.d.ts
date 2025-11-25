import type { MultipleSelectField, SingleSelectField } from '../../../../model';
interface IMultipleSelect {
    onSelect: (value: string[] | null) => void;
    value: string[] | null;
    field: MultipleSelectField | SingleSelectField;
    className?: string;
    popoverClassName?: string;
    modal?: boolean;
}
declare const FilterMultipleSelect: (props: IMultipleSelect) => import("react/jsx-runtime").JSX.Element;
export { FilterMultipleSelect };
