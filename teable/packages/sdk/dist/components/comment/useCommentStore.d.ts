/// <reference types="react" />
import type { ICommentVo } from '@teable/openapi';
interface IEditorRef {
    focus: () => void;
    blur: () => void;
}
interface ICommentState {
    quoteId?: string;
    editingCommentId?: string;
    editorRef: IEditorRef;
    attachmentPresignedUrls: Record<string, string>;
    commentList: ICommentVo[];
    listRef: React.RefObject<HTMLDivElement> | null;
    setQuoteId: (quoteId?: string) => void;
    setEditingCommentId: (editingCommentId?: string) => void;
    setEditorRef: (editorRef: IEditorRef) => void;
    setAttachmentPresignedUrls: (path: string, url: string) => void;
    setCommentList: (list: ICommentVo[]) => void;
    resetCommentStore: () => void;
}
export declare const useCommentStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ICommentState>>;
export {};
