import type { ISelectOption } from '../../../cell-value';
interface IOptionListProps {
    options: ISelectOption[];
    checkIsActive: (value: string) => boolean;
    onSelect: (value: string) => void;
}
export declare const OptionList: (props: IOptionListProps) => import("react/jsx-runtime").JSX.Element;
export {};
