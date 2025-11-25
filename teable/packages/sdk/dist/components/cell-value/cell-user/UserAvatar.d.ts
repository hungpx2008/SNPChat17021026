import { type ReactNode } from 'react';
export interface IUserAvatarProps {
    name: string;
    avatar?: ReactNode;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    formatImageUrl?: (url: string) => string;
}
export declare const UserAvatar: (props: IUserAvatarProps) => import("react/jsx-runtime").JSX.Element;
