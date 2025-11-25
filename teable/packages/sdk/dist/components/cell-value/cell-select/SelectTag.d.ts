import React from 'react';
export interface ISelectTag {
    label: string;
    color?: string;
    backgroundColor?: string;
    className?: string;
}
export declare const SelectTag: React.FC<React.PropsWithChildren<ISelectTag>>;
