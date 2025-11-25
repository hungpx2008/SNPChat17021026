/// <reference types="react" />
interface IColorProps {
    children: (text: string, isActive: boolean) => React.ReactNode;
}
export declare const Color: (props: IColorProps) => import("react").ReactNode;
export {};
