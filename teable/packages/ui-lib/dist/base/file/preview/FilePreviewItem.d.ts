/// <reference types="react" />
import { type IFileItem } from './FilePreviewContext';
interface IFilePreviewItem extends IFileItem {
    className?: string;
    children: React.ReactNode;
}
export declare const FilePreviewItem: (props: IFilePreviewItem) => import("react/jsx-runtime").JSX.Element;
export {};
