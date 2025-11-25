import type { SingleSelectField } from '../../../../model';
interface ISingleSelect {
    onSelect: (id: string | null) => void;
    operator: string;
    value: string | null;
    field: SingleSelectField;
    className?: string;
    popoverClassName?: string;
    modal?: boolean;
}
declare function FilterSingleSelect(props: ISingleSelect): import("react/jsx-runtime").JSX.Element;
export { FilterSingleSelect };
