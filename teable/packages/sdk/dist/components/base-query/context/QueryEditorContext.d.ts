import type { IBaseQuery, IBaseQueryColumn } from '@teable/openapi';
import React from 'react';
export type QueryEditorKey = Exclude<keyof IBaseQuery, 'from'>;
export type IContextColumns = (IBaseQueryColumn & {
    groupTableId?: string;
})[];
export interface IQueryEditorContext {
    columns: {
        from: IContextColumns;
        join: IContextColumns;
    };
    canSelectedColumnIds?: string[];
    status: Record<QueryEditorKey, boolean>;
    setStatus: (key: QueryEditorKey, value: boolean) => void;
}
export declare const QueryEditorContext: React.Context<IQueryEditorContext>;
