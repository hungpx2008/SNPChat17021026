import type { IUserCellValue } from '@teable/core';
import React from 'react';
import type { ICellEditor } from '../type';
import type { IUserEditorRef } from './EditorBase';
export interface IUserEditorMainProps extends ICellEditor<IUserCellValue | IUserCellValue[]> {
    isMultiple?: boolean;
    includeMe?: boolean;
    onChange?: (value?: IUserCellValue | IUserCellValue[]) => void;
    onSearch?: (value: string) => void;
    style?: React.CSSProperties;
    className?: string;
    initialSearch?: string;
}
export declare const UserEditorMain: React.ForwardRefExoticComponent<IUserEditorMainProps & React.RefAttributes<IUserEditorRef>>;
