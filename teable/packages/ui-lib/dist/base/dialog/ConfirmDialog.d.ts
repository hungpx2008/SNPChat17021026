import React from 'react';
interface IConfirmDialogProps {
    open?: boolean;
    contentClassName?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    closeable?: boolean;
    children?: React.ReactNode;
    content?: React.ReactNode;
    cancelText?: string;
    confirmText?: string;
    confirmLoading?: boolean;
    confirmDisabled?: boolean;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void | Promise<void>;
    onOpenChange?: (open: boolean) => void;
}
export declare const ConfirmDialog: (props: IConfirmDialogProps) => import("react/jsx-runtime").JSX.Element;
export {};
