/// <reference types="react" />
import type { IViewVo, ISort, IColumnMetaRo, IFilter, IGroup } from '@teable/core';
import type { IViewInstance } from '../../model/view/factory';
interface IPersonalViewProxyProps {
    serverData?: IViewVo[];
    children: React.ReactNode;
}
export interface IProxyPersonalView extends Omit<IViewInstance, 'updateFilter' | 'updateSort' | 'updateGroup' | 'updateOption' | 'updateColumnMeta'> {
    updateFilter: (filter: IFilter) => void;
    updateSort: (sort: ISort) => void;
    updateGroup: (group: IGroup) => void;
    updateOption: (option: Record<string, unknown>) => void;
    updateColumnMeta: (columnMeta: IColumnMetaRo) => void;
    syncViewProperties?: () => void | Promise<void>;
}
export declare const PersonalViewProxy: (props: IPersonalViewProxyProps) => import("react/jsx-runtime").JSX.Element;
export {};
