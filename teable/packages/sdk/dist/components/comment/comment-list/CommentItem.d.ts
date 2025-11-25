import type { ICommentVo } from '@teable/openapi';
import type { IBaseQueryParams } from '../types';
interface ICommentItemProps extends ICommentVo, IBaseQueryParams {
    commentId?: string;
}
export declare const CommentItem: (props: ICommentItemProps) => import("react/jsx-runtime").JSX.Element;
export {};
