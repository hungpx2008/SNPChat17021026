import type { IQueryEditorContext } from './QueryEditorContext';
export declare const QueryEditorProvider: (props: {
    columns: IQueryEditorContext['columns'];
    canSelectedColumnIds?: IQueryEditorContext['canSelectedColumnIds'];
    children: React.ReactNode;
    defaultStatus?: IQueryEditorContext['status'];
}) => import("react/jsx-runtime").JSX.Element;
