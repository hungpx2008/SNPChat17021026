import type { IGroupPointsRo } from '@teable/openapi';
import type { FC, ReactNode } from 'react';
interface GroupPointProviderProps {
    children: ReactNode;
    query?: IGroupPointsRo;
}
export declare const GroupPointProvider: FC<GroupPointProviderProps>;
export {};
