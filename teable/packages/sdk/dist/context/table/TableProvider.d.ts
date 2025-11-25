import type { ITableVo } from '@teable/openapi';
import type { FC, ReactNode } from 'react';
interface ITableProviderProps {
    serverData?: ITableVo[];
    children: ReactNode;
}
export declare const TableProvider: FC<ITableProviderProps>;
export {};
