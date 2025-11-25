import type { ReactNode } from 'react';
interface IConnectionProviderProps {
    wsPath?: string;
    children: ReactNode;
}
export declare const ConnectionProvider: ({ children, wsPath }: IConnectionProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
