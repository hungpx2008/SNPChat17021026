import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { User } from '@teable/icons';
import { cn } from '@teable/ui-lib';
import { UserAvatar } from '../../../../cell-value';
export const MentionUser = (props) => {
    const { className, name = '', avatar } = props;
    return (_jsx("div", { className: cn('inline-flex h-[22px] max-w-32 py-px', className), children: avatar ? (_jsxs(_Fragment, { children: [_jsx(UserAvatar, { avatar: avatar, name: name, className: "size-4 self-center" }), _jsx("span", { className: "inline-flex self-baseline truncate pl-1 leading-5", title: name, children: name })] })) : (_jsx("div", { className: "item-center flex size-4 shrink-0 justify-center self-center rounded-full bg-card", children: _jsx(User, { className: "self-center" }) })) }));
};
