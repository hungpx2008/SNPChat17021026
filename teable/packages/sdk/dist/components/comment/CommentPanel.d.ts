import type { IBaseQueryParams } from './types';
interface ICommentPanelProps extends IBaseQueryParams {
    baseId: string;
    tableId: string;
    recordId: string;
    commentId?: string;
}
export declare const CommentPanel: (props: ICommentPanelProps) => import("react/jsx-runtime").JSX.Element;
export {};
