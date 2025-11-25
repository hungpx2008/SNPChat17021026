/// <reference types="react" />
import type { IBaseQueryParams } from '../types';
export interface ICommentListProps extends IBaseQueryParams {
    commentId?: string;
}
export interface CommentListRefHandle {
    scrollToBottom: () => void;
}
export declare const CommentList: import("react").ForwardRefExoticComponent<ICommentListProps & import("react").RefAttributes<CommentListRefHandle>>;
