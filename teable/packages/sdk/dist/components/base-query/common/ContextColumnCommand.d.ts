import type { IBaseQueryColumn } from '@teable/openapi';
export declare const ContextColumnsCommand: (props: {
    checked?: string | string[] | undefined;
    isFilter?: boolean | undefined;
    onClick?: ((column: IBaseQueryColumn, options: {
        preSelected?: boolean;
        group?: {
            id: string;
            name: string;
        };
    }) => void) | undefined;
}) => import("react/jsx-runtime").JSX.Element;
