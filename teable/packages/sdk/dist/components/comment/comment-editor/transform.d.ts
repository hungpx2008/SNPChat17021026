import { CommentNodeType } from '@teable/openapi';
import type { TElement, Descendant } from '@udecode/plate';
export declare const hasOnlyProperty: (obj: Record<string, unknown>, propertyName: string) => boolean;
export declare const isTextCommentNode: (element: Descendant) => boolean;
export declare class EditorTransform {
    static editorValue2CommentValue: (value: TElement[]) => ({
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    } | {
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    })[];
    static commentValue2EditorValue: (value: ({
        type: CommentNodeType.Paragraph;
        children: ({
            type: CommentNodeType.Text;
            value: string;
        } | {
            type: CommentNodeType.Mention;
            value: string;
            name?: string | undefined;
            avatar?: string | undefined;
        } | {
            url: string;
            type: CommentNodeType.Link;
            title: string;
            value?: unknown;
        })[];
        value?: unknown;
    } | {
        path: string;
        type: CommentNodeType.Img;
        url?: string | undefined;
        value?: unknown;
        width?: number | undefined;
    })[]) => TElement[];
}
