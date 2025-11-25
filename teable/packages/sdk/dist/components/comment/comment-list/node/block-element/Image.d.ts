import type { IBaseNodeProps } from '../type';
interface IBlockImageElementProps extends IBaseNodeProps {
    path: string;
    url?: string;
    width?: number;
}
export declare const BlockImageElement: (props: IBlockImageElementProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
