import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardPortal } from '@teable/ui-lib';
import colors from 'tailwindcss/colors';
import { useTranslation } from '../../context/app/i18n';
import { useSession } from '../../hooks';
import { UserAvatar } from '../cell-value';
export const CollaboratorWithHoverCard = (props) => {
    const { id, name, avatar, email, borderColor } = props;
    const { user } = useSession();
    const { t } = useTranslation();
    return (_jsxs(HoverCard, { openDelay: 200, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsx("div", { className: "relative overflow-hidden", children: _jsx(UserAvatar, { name: name, avatar: avatar, className: "size-6 cursor-pointer border-2", style: {
                            borderColor: borderColor ?? colors.gray[500],
                        } }) }) }), _jsx(HoverCardPortal, { children: _jsxs(HoverCardContent, { className: "flex w-max max-w-[160px] flex-col justify-center truncate p-2 text-sm", children: [_jsxs("div", { className: "truncate", children: [_jsx("span", { title: name, children: name }), _jsx("span", { className: "pl-1", children: id === user.id ? `(${t('noun.you')})` : null })] }), _jsx("div", { className: "truncate", children: _jsx("span", { title: email, children: email }) })] }) })] }));
};
