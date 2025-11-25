/// <reference types="react" />
import type { IFieldRo } from '@teable/core';
interface IFieldCreatorProps {
    field: IFieldRo;
    setField: React.Dispatch<React.SetStateAction<IFieldRo | undefined>>;
}
export declare const FieldCreator: (props: IFieldCreatorProps) => import("react/jsx-runtime").JSX.Element;
export {};
