import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@teable/ui-lib';
import { UserAvatar } from './UserAvatar';
export const UserTag = (props) => {
    const { name, avatar, suffix, className, formatImageUrl } = props;
    return (_jsxs("div", { className: cn('flex items-center text-sm', className), children: [_jsx(UserAvatar, { name: name, avatar: avatar, formatImageUrl: formatImageUrl }), _jsxs("div", { className: "-ml-3 flex items-center overflow-hidden rounded-[6px] bg-secondary pl-4 pr-2 text-secondary-foreground", children: [_jsx("p", { className: "flex-1 truncate", title: name, children: name }), suffix] })] }));
};
