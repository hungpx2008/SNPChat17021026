import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage, cn } from '@teable/ui-lib';
import { useMemo, isValidElement } from 'react';
import { convertNextImageUrl } from '../../grid-enhancements';
export const UserOption = (props) => {
    const { className, name, email, avatar } = props;
    const avatarCom = useMemo(() => {
        if (isValidElement(avatar)) {
            return avatar;
        }
        return (_jsxs(_Fragment, { children: [_jsx(AvatarImage, { src: avatar
                        ? convertNextImageUrl({
                            url: avatar,
                            w: 64,
                            q: 75,
                        })
                        : undefined, alt: name }), _jsx(AvatarFallback, { className: "text-sm", children: name.slice(0, 1) })] }));
    }, [avatar, name]);
    return (_jsxs("div", { className: cn('flex items-center gap-4', className), children: [_jsx(Avatar, { className: "box-content size-7 cursor-pointer border", children: avatarCom }), _jsxs("div", { className: "flex-1 truncate", children: [_jsx("p", { className: "truncate text-sm font-medium leading-none", title: name, children: name }), email && (_jsx("p", { className: "truncate text-sm text-muted-foreground", title: email, children: email }))] })] }));
};
