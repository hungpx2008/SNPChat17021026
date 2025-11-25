/// <reference types="react" />
import type { ISelectOption } from '../../cell-value';
import type { ICellEditor, IEditorRef } from '../type';
export type ISelectValue<T extends boolean> = T extends true ? string[] : string;
export interface ISelectEditorMain<T extends boolean> extends ICellEditor<ISelectValue<T>> {
    preventAutoNewOptions?: boolean;
    options?: ISelectOption[];
    isMultiple?: T;
    style?: React.CSSProperties;
    className?: string;
    onOptionAdd?: (optionName: string) => Promise<void>;
    initialSearch?: string;
}
export declare const SelectEditorMain: import("react").ForwardRefExoticComponent<ISelectEditorMain<boolean> & import("react").RefAttributes<IEditorRef<string | string[] | undefined>>>;
