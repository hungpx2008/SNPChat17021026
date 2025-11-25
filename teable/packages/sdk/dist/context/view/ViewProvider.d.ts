import type { IViewVo } from '@teable/core';
import type { FC, ReactNode } from 'react';
interface IViewProviderProps {
    fallback?: ReactNode;
    serverData?: IViewVo[];
    children: ReactNode;
}
export declare const ViewProvider: FC<IViewProviderProps>;
export {};
