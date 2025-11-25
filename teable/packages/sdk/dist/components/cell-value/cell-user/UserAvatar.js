import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage, cn } from '@teable/ui-lib';
import { isValidElement } from 'react';
import { convertNextImageUrl } from '../../grid-enhancements/utils';
export const UserAvatar = (props) => {
    const { name, avatar, size = 64, className, style, formatImageUrl } = props;
    if (isValidElement(avatar)) {
        return avatar;
    }
    return (_jsxs(Avatar, { className: cn('size-6 border bg-background', {
            'bg-gray-300': name === 'Deleted User',
        }, className), style: style, children: [_jsx(AvatarImage, { src: avatar
                    ? formatImageUrl
                        ? formatImageUrl(avatar)
                        : convertNextImageUrl({
                            url: avatar,
                            w: size,
                            q: 75,
                        })
                    : undefined, alt: name }), _jsx(AvatarFallback, { children: name?.slice(0, 1) })] }));
};
