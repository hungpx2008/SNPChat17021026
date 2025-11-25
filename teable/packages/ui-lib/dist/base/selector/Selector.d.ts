/// <reference types="react" />
export interface ISelectorItem {
    id: string;
    name: string;
    icon?: React.ReactNode;
}
export type ISelectorProps<T = ISelectorItem> = {
    className?: string;
    contentClassName?: string;
    readonly?: boolean;
    selectedId?: string;
    placeholder?: string;
    searchTip?: string;
    emptyTip?: string;
    defaultName?: string;
    candidates?: T[];
    onChange?: (id: string) => void;
};
export declare const Selector: React.FC<ISelectorProps>;
