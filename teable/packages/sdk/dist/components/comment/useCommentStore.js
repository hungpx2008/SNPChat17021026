import { noop } from 'lodash';
import { create } from 'zustand';
export const useCommentStore = create((set) => ({
    quoteId: undefined,
    editingCommentId: undefined,
    attachmentPresignedUrls: {},
    commentList: [],
    listRef: null,
    setQuoteId: (quoteId) => {
        set((state) => {
            return {
                ...state,
                editingCommentId: undefined,
                quoteId,
            };
        });
    },
    setEditingCommentId: (editingCommentId) => {
        set((state) => {
            return {
                ...state,
                quoteId: undefined,
                editingCommentId,
            };
        });
    },
    editorRef: {
        focus: noop,
        blur: noop,
    },
    setAttachmentPresignedUrls: (path, url) => {
        set((state) => {
            return {
                ...state,
                attachmentPresignedUrls: {
                    ...state.attachmentPresignedUrls,
                    [path]: url,
                },
            };
        });
    },
    setCommentList: (list) => {
        set((state) => {
            return {
                ...state,
                commentList: [...list],
            };
        });
    },
    setEditorRef: (editorRef) => {
        set((state) => {
            return {
                ...state,
                editorRef,
            };
        });
    },
    resetCommentStore: () => {
        set(() => {
            return {
                quoteId: undefined,
                editingCommentId: undefined,
                attachmentPresignedUrls: {},
                commentList: [],
                editorRef: {
                    focus: noop,
                    blur: noop,
                },
            };
        });
    },
}));
