/// <reference types="react" />
type IAction = 'paste' | 'drop' | 'click';
interface IFileZoneProps {
    onChange?: (files: File[]) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
    defaultText?: string;
    action?: IAction | IAction[];
    fileInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
export declare const FileZone: (props: IFileZoneProps) => import("react/jsx-runtime").JSX.Element;
export {};
