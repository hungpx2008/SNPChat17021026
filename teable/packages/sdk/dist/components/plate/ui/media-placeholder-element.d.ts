import type { PlateElementProps } from '@udecode/plate/react';
import type { TPlaceholderElement } from '@udecode/plate-media';
import * as React from 'react';
export declare const MediaPlaceholderElement: React.ForwardRefExoticComponent<Omit<PlateElementProps<TPlaceholderElement>, "ref"> & React.RefAttributes<unknown>>;
export declare function ImageProgress({ className, file, imageRef, progress, }: {
    file: File;
    className?: string;
    imageRef?: React.RefObject<HTMLImageElement | null>;
    progress?: number;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function formatBytes(bytes: number, opts?: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
}): string;
