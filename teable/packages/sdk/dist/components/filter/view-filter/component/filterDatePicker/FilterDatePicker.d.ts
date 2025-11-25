import type { IDateFilter } from '@teable/core';
import type { DateField } from '../../../../../model';
interface IFilerDatePickerProps {
    value: IDateFilter | null;
    field: DateField;
    operator: string;
    onSelect: (value: IDateFilter | null) => void;
    modal?: boolean;
    className?: string;
    onModeChange?: (mode: IDateFilter['mode'] | null) => void;
}
declare function FilterDatePicker(props: IFilerDatePickerProps): import("react/jsx-runtime").JSX.Element;
export { FilterDatePicker };
