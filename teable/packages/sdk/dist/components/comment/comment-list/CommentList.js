import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getCommentList, CommentPatchType } from '@teable/openapi';
import { Spin, Button } from '@teable/ui-lib';
import { isEqual } from 'lodash';
import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback, useState } from 'react';
import { ReactQueryKeys } from '../../../config';
import { useTranslation } from '../../../context/app/i18n';
import { useSession } from '../../../hooks';
import { CommentItem } from './CommentItem';
import { CommentSkeleton } from './CommentSkeleton';
import { useCommentPatchListener } from './useCommentPatchListener';
export const CommentList = forwardRef((props, ref) => {
    const { tableId, recordId, commentId } = props;
    const { t } = useTranslation();
    const listRef = useRef(null);
    const [commentList, setCommentList] = useState([]);
    const { user: self } = useSession();
    useEffect(() => {
        // reset comment list when switch record
        setCommentList([]);
    }, [tableId, recordId]);
    const queryClient = useQueryClient();
    useEffect(() => {
        return () => queryClient.removeQueries(ReactQueryKeys.commentList(tableId, recordId));
    }, [queryClient, recordId, tableId]);
    const scrollToBottom = useCallback(() => {
        if (listRef.current) {
            const scrollHeight = listRef.current.scrollHeight;
            listRef.current.scrollTo({
                top: scrollHeight,
                behavior: 'smooth',
            });
        }
    }, []);
    const scrollDownSlightly = useCallback(() => {
        if (listRef.current) {
            const scrollTop = listRef.current.scrollTop;
            listRef.current.scrollTo({
                top: scrollTop + 48,
                behavior: 'smooth',
            });
        }
    }, []);
    useImperativeHandle(ref, () => ({
        scrollToBottom: scrollToBottom,
    }));
    const { data, fetchPreviousPage, isFetchingPreviousPage, hasPreviousPage, isLoading } = useInfiniteQuery({
        queryKey: ReactQueryKeys.commentList(tableId, recordId),
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
        queryFn: ({ pageParam }) => getCommentList(tableId, recordId, {
            cursor: pageParam?.cursor,
            take: 20,
            direction: pageParam?.direction || 'forward',
        }).then((res) => res.data),
        getPreviousPageParam: (firstPage) => firstPage.nextCursor
            ? {
                cursor: firstPage.nextCursor,
                direction: 'forward',
            }
            : undefined,
        onSuccess: (data) => {
            // first come move to bottom
            if (data.pages.length === 1 && listRef.current) {
                const scrollToBottom = () => {
                    if (listRef.current) {
                        const scrollHeight = listRef.current.scrollHeight;
                        listRef.current.scrollTop = scrollHeight;
                    }
                };
                setTimeout(scrollToBottom, 100);
            }
        },
        enabled: !!tableId && !!recordId,
    });
    useEffect(() => {
        let result = [...commentList];
        const pageList = data?.pages.flatMap((page) => page.comments);
        if (Array.isArray(pageList)) {
            const uniqueComments = {};
            [...pageList, ...result].forEach((comment) => {
                uniqueComments[comment.id] = comment;
            });
            const mergedList = Object.values(uniqueComments);
            result = mergedList;
        }
        result = result.sort((a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime());
        if (!isEqual(result, commentList)) {
            setCommentList(result);
        }
    }, [commentList, data?.pages]);
    const commentListener = useCallback((remoteData) => {
        const { data, type } = remoteData;
        switch (type) {
            case CommentPatchType.CreateComment: {
                setCommentList((prevList) => [
                    ...prevList,
                    {
                        ...data,
                    },
                ]);
                if (data.createdBy === self.id) {
                    setTimeout(() => {
                        scrollToBottom();
                    }, 100);
                }
                else {
                    setTimeout(() => {
                        scrollDownSlightly();
                    }, 100);
                }
                break;
            }
            case CommentPatchType.DeleteComment: {
                setCommentList((prevList) => prevList.filter((comment) => comment.id !== data.id));
                break;
            }
            case CommentPatchType.UpdateComment:
            case CommentPatchType.CreateReaction:
            case CommentPatchType.DeleteReaction: {
                setCommentList((prevList) => {
                    const newList = [...prevList];
                    const index = newList.findIndex((list) => list.id === data.id);
                    if (index > -1) {
                        newList[index] = { ...data };
                    }
                    return newList;
                });
                break;
            }
        }
    }, [scrollDownSlightly, scrollToBottom, self.id]);
    useCommentPatchListener(tableId, recordId, commentListener);
    return (_jsx("div", { className: "my-2 flex w-full flex-1 flex-col gap-2 overflow-y-auto px-2", ref: listRef, children: isLoading ? (_jsx(CommentSkeleton, {})) : (_jsxs(_Fragment, { children: [isFetchingPreviousPage ? (_jsx("div", { className: "flex h-6 w-full justify-center", children: _jsx(Spin, {}) })) : (hasPreviousPage && (_jsx(Button, { size: "xs", variant: 'ghost', onClick: () => fetchPreviousPage(), className: "p-1", children: t('common.loadMore') }))), commentList?.length ? (commentList.map((comment) => (_jsx(CommentItem, { ...comment, tableId: tableId, recordId: recordId, commentId: commentId }, comment.id)))) : (_jsx("div", { className: "flex size-full items-center justify-center text-center text-gray-400", children: t('comment.emptyComment') }))] })) }));
});
CommentList.displayName = 'CommentList';
