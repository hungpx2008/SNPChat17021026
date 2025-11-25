/// <reference types="react" />
export interface IConfirmModalOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}
interface IConfirmModalContext {
    openModal: (options: IConfirmModalOptions) => void;
}
export declare const confirmModalContext: import("react").Context<IConfirmModalContext | null>;
export declare const useConfirmModal: () => IConfirmModalContext;
export {};
