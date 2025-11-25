import type { FC, ReactNode } from 'react';
interface IBaseProviderProps {
    children: ReactNode;
    fallback?: React.ReactNode;
}
export declare const BaseProvider: FC<IBaseProviderProps>;
export {};
