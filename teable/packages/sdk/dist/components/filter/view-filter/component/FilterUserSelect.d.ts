import type { UserField, CreatedByField, LastModifiedByField } from '../../../../model';
interface IFilterUserProps {
    field: UserField | CreatedByField | LastModifiedByField;
    operator: string;
    value: string[] | string | null;
    onSearch?: (value: string) => void;
    onSelect: (value: string[] | string | null) => void;
    modal?: boolean;
    className?: string;
}
interface IFilterUserBaseProps extends IFilterUserProps {
    data?: {
        userId: string;
        userName: string;
        avatar?: string | null;
    }[];
    disableMe?: boolean;
}
declare const FilterUserSelectBase: (props: IFilterUserBaseProps) => import("react/jsx-runtime").JSX.Element;
declare const FilterUserSelect: (props: IFilterUserProps) => import("react/jsx-runtime").JSX.Element;
export { FilterUserSelect, FilterUserSelectBase };
