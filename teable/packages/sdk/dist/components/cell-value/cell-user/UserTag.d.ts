import type { ReactNode } from 'react';
interface IUserTag {
    name: string;
    avatar?: ReactNode | string | null;
    className?: string;
    suffix?: ReactNode;
    formatImageUrl?: (url: string) => string;
}
export declare const UserTag: (props: IUserTag) => import("react/jsx-runtime").JSX.Element;
export {};
