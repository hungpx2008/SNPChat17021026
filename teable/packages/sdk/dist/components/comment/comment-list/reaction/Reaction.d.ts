import type { ICommentVo } from '@teable/openapi';
interface ICommentReactionProps {
    commentId: string;
    value: ICommentVo['reaction'];
}
export declare const Reaction: (props: ICommentReactionProps) => import("react/jsx-runtime").JSX.Element;
export {};
