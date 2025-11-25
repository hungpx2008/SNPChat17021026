import { type FC, type PropsWithChildren } from 'react';
export declare const Modal: FC<PropsWithChildren<{
    modal?: boolean;
    className?: string;
    container?: HTMLDivElement;
    visible?: boolean;
    onClose?: () => void;
}>>;
