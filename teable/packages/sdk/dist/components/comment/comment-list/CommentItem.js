import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageSquare, Edit, Trash2 } from '@teable/icons';
import { deleteComment, createCommentReaction } from '@teable/openapi';
import { HoverCard, HoverCardContent, HoverCardTrigger, Button, cn, HoverCardPortal, } from '@teable/ui-lib';
import { useState, useRef, useEffect } from 'react';
import { ReactQueryKeys } from '../../../config';
import { useTranslation } from '../../../context/app/i18n';
import { useLanDayjs, useSession } from '../../../hooks';
import { UserAvatar } from '../../cell-value';
import { useModalRefElement } from '../../expand-record/useModalRefElement';
import { CommentQuote } from '../comment-editor/CommentQuote';
import { useCommentStore } from '../useCommentStore';
import { CommentContent } from './CommentContent';
import { CommentListContext } from './context';
import { Reaction, ReactionPicker } from './reaction';
export const CommentItem = (props) => {
    const { createdBy, createdTime, content, id, recordId, tableId, quoteId, lastModifiedTime, reaction, commentId, } = props;
    const dayjs = useLanDayjs();
    const { t } = useTranslation();
    const [emojiPickOpen, setEmojiPickOpen] = useState(false);
    const relativeTime = dayjs(createdTime).fromNow();
    const { setQuoteId, setEditingCommentId, editorRef } = useCommentStore();
    const { user } = useSession();
    const isMe = user?.id === createdBy?.id;
    const queryClient = useQueryClient();
    const { mutateAsync: deleteCommentFn } = useMutation({
        mutationFn: ({ tableId, recordId, id }) => deleteComment(tableId, recordId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ReactQueryKeys.commentDetail(tableId, recordId, id),
            });
            queryClient.invalidateQueries({
                queryKey: ReactQueryKeys.recordCommentCount(tableId, recordId),
            });
        },
    });
    const modalRef = useModalRefElement();
    const itemRef = useRef(null);
    const firstRef = useRef(true);
    useEffect(() => {
        if (commentId && itemRef && commentId === id && firstRef.current) {
            setTimeout(() => {
                itemRef?.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
                firstRef.current = false;
            }, 200);
        }
    }, [commentId, id]);
    const { mutateAsync: createCommentEmojiFn } = useMutation({
        mutationFn: ({ tableId, recordId, commentId, reactionRo, }) => createCommentReaction(tableId, recordId, commentId, reactionRo),
    });
    return (createdBy && (_jsxs(HoverCard, { openDelay: 200, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsxs("div", { className: cn('flex w-full gap-1 rounded-sm p-2 hover:bg-secondary', {
                        'flex-row-reverse': isMe,
                    }), ref: itemRef, children: [_jsx("div", { children: _jsx(UserAvatar, { name: createdBy.name, avatar: createdBy.avatar }) }), _jsxs("div", { className: "flex-1 truncate px-1", children: [_jsxs("div", { className: cn('flex flex-1 truncate text-xs gap-1 items-center', {
                                        'flex-row-reverse': isMe,
                                    }), children: [_jsx("span", { className: cn('truncate', {
                                                'text-end': isMe,
                                            }), children: createdBy.name }), _jsx("span", { className: "shrink-0 text-xs text-secondary-foreground/60", children: relativeTime }), lastModifiedTime && (_jsx("span", { className: "shrink-0 text-xs text-secondary-foreground/50", children: t('comment.tip.edited') }))] }), _jsx("div", { className: cn('pt-1 flex flex-col'), children: _jsxs(CommentListContext.Provider, { value: {
                                            isMe: isMe,
                                        }, children: [_jsx(CommentContent, { content: content }), _jsx(CommentQuote, { quoteId: quoteId, className: cn('flex w-auto max-w-full self-start truncate rounded-md bg-secondary p-1 text-xs text-secondary-foreground/50 mt-0.5', {
                                                    'self-end': isMe,
                                                }) })] }) }), _jsx(Reaction, { value: reaction, commentId: id })] })] }) }), _jsx(HoverCardPortal, { container: modalRef.current, children: _jsxs(HoverCardContent, { side: "top", className: "size-auto p-1", sideOffset: -10, hideWhenDetached: true, sticky: "always", children: [_jsxs(HoverCard, { open: emojiPickOpen, onOpenChange: (open) => {
                                setEmojiPickOpen(open);
                            }, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsx(Button, { variant: 'ghost', size: 'xs', onClick: () => {
                                            setEmojiPickOpen(true);
                                        }, children: _jsx(Heart, {}) }) }), _jsx(HoverCardPortal, { container: modalRef.current, children: _jsx(HoverCardContent, { side: "top", className: "size-auto p-0.5", hideWhenDetached: true, children: _jsx(ReactionPicker, { onReactionClick: (emoji) => {
                                                createCommentEmojiFn({
                                                    tableId,
                                                    recordId,
                                                    commentId: id,
                                                    reactionRo: { reaction: emoji },
                                                }).then(() => {
                                                    setTimeout(() => {
                                                        itemRef?.current &&
                                                            itemRef?.current?.scrollIntoView({
                                                                behavior: 'smooth',
                                                                block: 'nearest',
                                                            });
                                                    }, 200);
                                                });
                                            } }) }) })] }), _jsx(Button, { variant: 'ghost', size: 'xs', onClick: () => {
                                setQuoteId(id);
                                editorRef.focus();
                            }, children: _jsx(MessageSquare, {}) }), isMe && (_jsx(Button, { variant: 'ghost', size: 'xs', onClick: () => {
                                setEditingCommentId(id);
                                editorRef.focus();
                            }, children: _jsx(Edit, {}) })), isMe && (_jsx(Button, { variant: 'ghost', size: 'xs', onClick: () => {
                                deleteCommentFn({ tableId, recordId, id });
                            }, children: _jsx(Trash2, {}) }))] }) })] })));
};
