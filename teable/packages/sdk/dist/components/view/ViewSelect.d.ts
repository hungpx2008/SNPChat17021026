import type { ViewType } from '@teable/core';
interface ViewSelectProps {
    value?: string | null;
    tableId: string;
    className?: string;
    typeFilter?: ViewType;
    cancelable?: boolean;
    onChange: (value: string | null) => void;
}
export declare const ViewSelect: (props: ViewSelectProps) => import("react/jsx-runtime").JSX.Element;
export {};
