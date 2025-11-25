/// <reference types="react" />
interface IUserItemProps {
    className?: string;
    name: string;
    email?: string;
    avatar?: string;
    checked?: boolean;
    showCheckbox?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    suffix?: React.ReactNode;
}
export declare const UserItem: ({ className, name, email, avatar, checked, showCheckbox, onCheckedChange, suffix, }: IUserItemProps) => import("react/jsx-runtime").JSX.Element;
export {};
