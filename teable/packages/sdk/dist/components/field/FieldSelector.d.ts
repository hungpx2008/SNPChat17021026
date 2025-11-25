/// <reference types="react" />
import type { IFieldInstance } from '../../model';
interface IFieldSelector {
    fields?: IFieldInstance[];
    value?: string;
    className?: string;
    excludedIds?: string[];
    container?: HTMLElement;
    onSelect?: (value: string) => void;
    withHidden?: boolean;
    placeholder?: string;
    emptyHolder?: React.ReactNode;
    children?: React.ReactNode;
    modal?: boolean;
    showTableName?: boolean;
    tableId?: string;
    tableName?: string;
    isOptionDisabled?: (field: IFieldInstance) => boolean;
}
export declare function FieldSelector(props: IFieldSelector): import("react/jsx-runtime").JSX.Element;
export {};
