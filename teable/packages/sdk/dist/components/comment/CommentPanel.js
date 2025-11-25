import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { CommentEditor } from './comment-editor';
import { CommentList } from './comment-list';
import { CommentHeader } from './CommentHeader';
import { CommentContext } from './context';
import { useCommentStore } from './useCommentStore';
export const CommentPanel = (props) => {
    const { baseId, recordId, tableId, commentId } = props;
    const { resetCommentStore } = useCommentStore();
    useEffect(() => {
        return () => {
            resetCommentStore?.();
        };
    }, [resetCommentStore]);
    return (_jsx(CommentContext.Provider, { value: { baseId, recordId }, children: _jsxs("div", { className: "flex size-full flex-col border-l bg-background", children: [_jsx(CommentHeader, { tableId: tableId, recordId: recordId }), _jsx(CommentList, { tableId: tableId, recordId: recordId, commentId: commentId }), _jsx(CommentEditor, { tableId: tableId, recordId: recordId })] }) }));
};
