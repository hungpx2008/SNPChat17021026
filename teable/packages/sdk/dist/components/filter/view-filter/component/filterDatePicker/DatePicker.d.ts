import type { DateField } from '../../../../../model';
interface IFilerDatePickerProps {
    value: string | null | undefined;
    field: DateField;
    onSelect: (date: string) => void;
}
declare function DatePicker(props: IFilerDatePickerProps): import("react/jsx-runtime").JSX.Element;
export { DatePicker };
