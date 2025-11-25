/// <reference types="react" />
import type { IUserCellValue } from '@teable/core';
import type { ICellEditor, IEditorRef } from '../type';
import type { ICollaborator } from './types';
export interface IUserEditorBaseProps extends ICellEditor<IUserCellValue | IUserCellValue[]> {
    isMultiple?: boolean;
    onChange?: (value?: IUserCellValue | IUserCellValue[]) => void;
    className?: string;
    onSearch?: (value: string) => void;
    collaborators?: ICollaborator[];
    isLoading?: boolean;
    initialSearch?: string;
}
export type IUserEditorRef = IEditorRef<IUserCellValue | IUserCellValue[] | undefined>;
export declare const UserEditorBase: import("react").ForwardRefExoticComponent<IUserEditorBaseProps & import("react").RefAttributes<IUserEditorRef>>;
