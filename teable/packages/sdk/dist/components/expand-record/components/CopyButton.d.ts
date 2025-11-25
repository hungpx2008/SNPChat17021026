import type { ButtonProps } from '@teable/ui-lib';
interface ICopyButtonProps extends ButtonProps {
    text: string;
    className?: string;
    iconClassName?: string;
}
export declare const CopyButton: (props: ICopyButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
