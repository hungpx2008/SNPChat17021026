import React from 'react';
import type { IFieldInstance } from '../../model';
interface IFieldCommand {
    fields?: IFieldInstance[];
    onSelect?: (fieldId: string) => void;
    className?: string;
    selectedIds?: string[];
    placeholder?: string;
    emptyHolder?: React.ReactNode;
    groupHeading?: string;
    isDisabled?: (field: IFieldInstance) => boolean;
}
export declare function FieldCommand(props: IFieldCommand): import("react/jsx-runtime").JSX.Element;
export {};
