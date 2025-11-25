import type { RowHeightLevel } from '@teable/core';
import React from 'react';
export declare const RowHeight: React.FC<{
    rowHeight?: RowHeightLevel;
    fieldNameDisplayLines?: number;
    onChange?: (type: 'rowHeight' | 'fieldNameDisplayLines', value: RowHeightLevel | number) => void;
    children: (text: string, isActive: boolean, Icon: React.FC<{
        className?: string;
    }>) => React.ReactNode;
}>;
