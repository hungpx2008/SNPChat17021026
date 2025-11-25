/// <reference types="react" />
interface IUserTagProps {
    className?: string;
    name: string;
    email?: string;
    avatar?: string | null | React.ReactNode;
}
export declare const UserOption: (props: IUserTagProps) => import("react/jsx-runtime").JSX.Element;
export {};
