/// <reference types="react" />
import type { ILinkCellValue, ILinkFieldOptions } from '@teable/core';
export interface ILinkEditorMainProps {
    fieldId: string;
    recordId?: string;
    options: ILinkFieldOptions;
    container?: HTMLElement;
    cellValue?: ILinkCellValue | ILinkCellValue[];
    isEditing?: boolean;
    setEditing?: (isEditing: boolean) => void;
    onChange?: (value: ILinkCellValue | ILinkCellValue[] | null) => void;
    onExpand?: (recordId: string) => void;
}
export interface ILinkEditorMainRef {
    onReset: () => void;
}
export declare const LinkEditorMain: import("react").ForwardRefExoticComponent<ILinkEditorMainProps & import("react").RefAttributes<ILinkEditorMainRef>>;
