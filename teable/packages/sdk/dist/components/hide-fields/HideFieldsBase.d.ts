import React from 'react';
import type { IFieldInstance } from '../../model';
interface IHideFieldsBaseProps {
    fields: IFieldInstance[];
    hidden: string[];
    footer?: React.ReactNode;
    children: React.ReactNode;
    onChange: (hidden: string[]) => void;
    onOrderChange?: (fieldId: string, fromIndex: number, toIndex: number) => void;
}
export declare const HideFieldsBase: (props: IHideFieldsBaseProps) => import("react/jsx-runtime").JSX.Element;
export {};
