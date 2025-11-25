import type { IFieldVo } from '@teable/core';
import type { FC, ReactNode } from 'react';
interface IFieldProviderProps {
    children: ReactNode;
    serverSideData?: IFieldVo[];
    fallback?: React.ReactNode;
}
export declare const FieldProvider: FC<IFieldProviderProps>;
export {};
