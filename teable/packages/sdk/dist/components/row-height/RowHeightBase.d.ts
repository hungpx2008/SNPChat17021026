import type { RowHeightLevel } from '@teable/core';
import React from 'react';
interface IRowHeightBaseProps {
    rowHeight?: RowHeightLevel;
    fieldNameDisplayLines?: number;
    onChange?: (type: 'rowHeight' | 'fieldNameDisplayLines', value: RowHeightLevel | number) => void;
    children: React.ReactNode;
}
export declare const RowHeightBase: (props: IRowHeightBaseProps) => import("react/jsx-runtime").JSX.Element;
export {};
