import React from 'react';
import type { ILocale } from './i18n';
export interface IAppContext {
    locale: ILocale;
    lang?: string;
    shareId?: string;
}
export declare const AppContext: React.Context<IAppContext>;
