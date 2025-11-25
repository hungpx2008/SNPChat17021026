import type { IUserFieldOptions } from '@teable/core';
import type { IUserEditorMainProps } from './EditorMain';
interface IUserEditorProps extends Omit<IUserEditorMainProps, 'isMultiple'> {
    options: IUserFieldOptions;
}
export declare const UserEditor: (props: IUserEditorProps) => import("react/jsx-runtime").JSX.Element;
export {};
