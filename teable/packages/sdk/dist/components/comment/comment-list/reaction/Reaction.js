import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from '@tanstack/react-query';
import { deleteCommentReaction, createCommentReaction } from '@teable/openapi';
import { Button, cn, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@teable/ui-lib';
import { useTranslation } from '../../../../context/app/i18n';
import { useSession, useTableId } from '../../../../hooks';
import { useRecordId } from '../../hooks';
export const Reaction = (props) => {
    const { value, commentId } = props;
    const tableId = useTableId();
    const recordId = useRecordId();
    const { user: sessionUser } = useSession();
    const { t } = useTranslation();
    const { mutateAsync: createCommentReactionFn } = useMutation({
        mutationFn: ({ tableId, recordId, commentId, reactionRo, }) => createCommentReaction(tableId, recordId, commentId, reactionRo),
    });
    const { mutateAsync: deleteCommentEmojiFn } = useMutation({
        mutationFn: ({ tableId, recordId, commentId, reactionRo, }) => deleteCommentReaction(tableId, recordId, commentId, reactionRo),
    });
    const reactionHandler = async (emoji) => {
        const users = value?.find((item) => item.reaction === emoji)?.user || [];
        if (!tableId || !recordId) {
            return;
        }
        if (users.some((item) => item.id === sessionUser.id)) {
            await deleteCommentEmojiFn({ tableId, recordId, commentId, reactionRo: { reaction: emoji } });
        }
        else {
            await createCommentReactionFn({
                tableId,
                recordId,
                commentId,
                reactionRo: { reaction: emoji },
            });
        }
    };
    const reactionUsersInfoRender = (users, reaction) => {
        const getUserName = (user) => {
            return user.id === sessionUser.id ? t('comment.tip.me') : user.name;
        };
        const usersText = users.length !== 2
            ? users.reduce((pre, cur) => `${pre ? `${pre}, ` : ''}${getUserName(cur)}`, '')
            : `${getUserName(users[0])} ${t('comment.tip.connection')} ${getUserName(users[1])}`;
        const reactionTip = t('comment.tip.reactionUserSuffix', { emoji: reaction });
        return `${usersText} ${reactionTip}`;
    };
    return (_jsx(TooltipProvider, { children: _jsx("div", { className: "mt-1 flex max-h-24 w-full flex-wrap gap-1 overflow-auto", children: value?.map(({ reaction, user }, index) => (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs(Button, { variant: 'outline', size: 'xs', className: cn('flex cursor-pointer items-center gap-2 rounded-full border px-1.5 py-0.5 text-xs min-w-12 max-w-16', {
                                'bg-blue-100/20 border-blue-200': user.findIndex((item) => item?.id === sessionUser?.id) > -1,
                            }), onClick: (e) => {
                                e.stopPropagation();
                                reactionHandler(reaction);
                            }, children: [_jsx("span", { className: cn('text-xs shrink-0'), children: reaction }), _jsx("span", { className: "truncate text-secondary-foreground", children: user.length < 99 ? user.length : '99+' })] }) }), _jsx(TooltipContent, { children: _jsx("p", { className: "whitespace-pre-wrap break-words", children: reactionUsersInfoRender(user, reaction) }) })] }, index))) }) }));
};
