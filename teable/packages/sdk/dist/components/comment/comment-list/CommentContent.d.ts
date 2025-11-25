import type { ICommentContent } from '@teable/openapi';
interface ICommentContentProps {
    content: ICommentContent;
    className?: string;
    isExpanded?: boolean;
}
export declare const CommentContent: (props: ICommentContentProps) => import("react/jsx-runtime").JSX.Element;
export {};
