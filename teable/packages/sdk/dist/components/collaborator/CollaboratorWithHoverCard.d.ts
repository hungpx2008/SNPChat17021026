import type { ReactNode } from 'react';
import type { IUser } from '../../context';
export type ICollaboratorUser = Omit<IUser, 'phone' | 'notifyMeta' | 'hasPassword' | 'isAdmin' | 'avatar'> & {
    borderColor?: string;
    avatar?: ReactNode;
};
export declare const CollaboratorWithHoverCard: (props: ICollaboratorUser) => import("react/jsx-runtime").JSX.Element;
