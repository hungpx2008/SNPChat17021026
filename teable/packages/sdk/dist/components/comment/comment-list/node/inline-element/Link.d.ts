import type { IBaseNodeProps } from '../type';
interface InlineLinkElementProps extends IBaseNodeProps {
    href: string;
    title?: string;
}
export declare const InlineLinkElement: (props: InlineLinkElementProps) => import("react/jsx-runtime").JSX.Element;
export {};
