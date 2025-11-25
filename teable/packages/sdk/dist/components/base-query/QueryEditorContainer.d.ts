import type { IBaseQuery } from '@teable/openapi';
export declare const QueryEditorContainer: ({ query, onChange, }: {
    query: IBaseQuery;
    onChange: <T extends "where" | "select" | "from" | "groupBy" | "orderBy" | "limit" | "offset" | "join" | "aggregation">(key: T, value: IBaseQuery[T]) => void;
}) => import("react/jsx-runtime").JSX.Element;
