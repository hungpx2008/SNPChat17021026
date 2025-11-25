import type { ILinkCellValue, ILinkFieldOptions } from '@teable/core';
interface ILinkEditorProps {
    options: ILinkFieldOptions;
    fieldId: string;
    recordId?: string;
    readonly?: boolean;
    className?: string;
    cellValue?: ILinkCellValue | ILinkCellValue[];
    displayType?: LinkDisplayType;
    onChange?: (value: ILinkCellValue | ILinkCellValue[] | null) => void;
}
export declare enum LinkDisplayType {
    Grid = "grid",
    List = "list"
}
export declare const LinkEditor: (props: ILinkEditorProps) => import("react/jsx-runtime").JSX.Element;
export {};
