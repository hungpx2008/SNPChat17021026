import type { IQueryBaseRo } from '@teable/openapi';
import type { FC, ReactNode } from 'react';
interface RowCountProviderProps {
    children: ReactNode;
    query?: IQueryBaseRo;
}
export declare const RowCountProvider: FC<RowCountProviderProps>;
export {};
