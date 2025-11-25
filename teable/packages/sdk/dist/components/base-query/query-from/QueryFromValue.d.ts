import type { IBaseQuery } from '@teable/openapi';
export declare const QueryFromTableValue: ({ from, onChange, component, }: {
    from?: string | IBaseQuery | undefined;
    onChange: (from?: string) => void;
    component?: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
