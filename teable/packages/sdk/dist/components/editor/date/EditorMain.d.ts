/// <reference types="react" />
import { type IDateFieldOptions } from '@teable/core';
import type { ICellEditor, IEditorRef } from '../type';
export interface IDateEditorMain extends ICellEditor<string | null> {
    style?: React.CSSProperties;
    options?: IDateFieldOptions;
    disableTimePicker?: boolean;
}
export declare const DateEditorMain: import("react").ForwardRefExoticComponent<IDateEditorMain & import("react").RefAttributes<IEditorRef<string>>>;
