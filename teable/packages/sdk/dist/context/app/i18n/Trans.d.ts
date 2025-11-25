import type { ReactElement } from 'react';
type ComponentsMap = Record<string, ReactElement>;
interface TransProps {
    i18nKey: string;
    components?: ComponentsMap;
    values?: Record<string, unknown>;
}
export declare const Trans: ({ i18nKey, components, values }: TransProps) => import("react/jsx-runtime").JSX.Element;
export {};
