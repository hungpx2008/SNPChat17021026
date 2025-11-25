import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Bell, ChevronDown } from '@teable/icons';
import { getCommentSubscribe, createCommentSubscribe, deleteCommentSubscribe, } from '@teable/openapi';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@teable/ui-lib';
import { ReactQueryKeys } from '../../config';
import { useTranslation } from '../../context/app/i18n';
export const CommentHeader = (props) => {
    const { tableId, recordId } = props;
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { data: subscribeStatus } = useQuery({
        queryKey: ReactQueryKeys.commentSubscribeStatus(tableId, recordId),
        queryFn: () => getCommentSubscribe(tableId, recordId).then((res) => {
            return res.data;
        }),
        enabled: !!(tableId && recordId),
    });
    const { mutateAsync: createSubscribe } = useMutation({
        mutationFn: ({ tableId, recordId }) => createCommentSubscribe(tableId, recordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ReactQueryKeys.commentSubscribeStatus(tableId, recordId),
            });
        },
    });
    const { mutateAsync: deleteSubscribeFn } = useMutation({
        mutationFn: ({ tableId, recordId }) => deleteCommentSubscribe(tableId, recordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ReactQueryKeys.commentSubscribeStatus(tableId, recordId),
            });
        },
    });
    const subscribeHandler = () => {
        if (!subscribeStatus) {
            createSubscribe({ tableId: tableId, recordId: recordId });
        }
        else {
            deleteSubscribeFn({ tableId: tableId, recordId: recordId });
        }
    };
    const subscribeComment = () => {
        if (!subscribeStatus) {
            createSubscribe({ tableId: tableId, recordId: recordId });
        }
    };
    const unsubscribeComment = () => {
        if (subscribeStatus) {
            deleteSubscribeFn({ tableId: tableId, recordId: recordId });
        }
    };
    return (_jsxs("div", { className: "flex h-[52px] items-center justify-between border-b p-1 px-3", children: [_jsx("div", { children: t('comment.title') }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: 'xs', className: "gap-2 p-2", children: [_jsx(Bell, { className: "size-4" }), _jsx("span", { className: "text-sm", children: subscribeStatus ? t('comment.tip.all') : t('comment.tip.relatedToMe') }), _jsx(ChevronDown, { className: "size-4 text-muted-foreground" })] }) }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { className: "text-sm", onSelect: () => subscribeComment(), children: t('comment.tip.notifyAll') }), _jsx(DropdownMenuItem, { className: "text-sm", onSelect: () => unsubscribeComment(), children: t('comment.tip.notifyRelatedToMe') })] })] })] }));
};
