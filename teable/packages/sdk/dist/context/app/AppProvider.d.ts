/// <reference types="react" />
import type { ILocalePartial } from './i18n';
interface IAppProviderProps {
    forcedTheme?: string;
    children: React.ReactNode;
    wsPath?: string;
    lang?: string;
    locale?: ILocalePartial;
    dehydratedState?: unknown;
    disabledWs?: boolean;
}
export declare const AppProvider: (props: IAppProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
