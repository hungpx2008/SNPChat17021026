import type { IUserMeVo } from '@teable/openapi';
import React from 'react';
export type IUser = IUserMeVo;
export type ISession = {
    user?: IUser;
};
export type ISessionContext = ISession & {
    refresh: () => void;
    refreshAvatar: () => void;
};
export declare const SessionContext: React.Context<ISessionContext>;
