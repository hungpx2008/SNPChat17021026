/// <reference types="react" />
export interface ICellValue<T> {
    value?: T;
    className?: string;
    style?: React.CSSProperties;
    ellipsis?: boolean;
}
