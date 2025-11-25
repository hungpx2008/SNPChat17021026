import type { IQueryBaseRo } from '@teable/openapi';
import type { FC, ReactNode } from 'react';
interface IAggregationProviderProps {
    children: ReactNode;
    query?: IQueryBaseRo;
}
export declare const AggregationProvider: FC<IAggregationProviderProps>;
export {};
