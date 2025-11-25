/// <reference types="react" />
interface IDepartmentItemProps {
    className?: string;
    name: string;
    checked: boolean;
    onClick?: () => void;
    onCheckedChange?: (checked: boolean) => void;
    suffix?: React.ReactNode;
    showCheckbox?: boolean;
}
export declare const DepartmentItem: ({ className, name, checked, suffix, onClick, onCheckedChange, showCheckbox, }: IDepartmentItemProps) => import("react/jsx-runtime").JSX.Element;
export {};
