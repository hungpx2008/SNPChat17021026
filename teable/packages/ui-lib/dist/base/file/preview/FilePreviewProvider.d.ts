/// <reference types="react" />
interface IFilePreviewProvider {
    container?: HTMLElement | null;
    children?: React.ReactNode;
    i18nMap?: Record<string, string>;
}
export declare const FilePreviewProvider: (props: IFilePreviewProvider) => import("react/jsx-runtime").JSX.Element;
export {};
