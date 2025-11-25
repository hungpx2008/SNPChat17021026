import type { IBaseQuery } from '@teable/openapi';
import type { QueryEditorKey } from './context/QueryEditorContext';
export declare const QueryEditor: ({ type, query, onChange, }: {
    type: QueryEditorKey;
    query: IBaseQuery;
    onChange: <T extends "where" | "select" | "from" | "groupBy" | "orderBy" | "limit" | "offset" | "join" | "aggregation">(key: T, value: IBaseQuery[T]) => void;
}) => import("react/jsx-runtime").JSX.Element | null;
