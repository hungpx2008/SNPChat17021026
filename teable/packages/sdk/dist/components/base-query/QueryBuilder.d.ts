/// <reference types="react" />
import type { IBaseQuery } from '@teable/openapi';
export interface IBaseQueryBuilderRef {
    validateQuery: () => boolean;
    initContext: (query?: IBaseQuery) => void;
}
export declare const BaseQueryBuilder: import("react").ForwardRefExoticComponent<{
    className?: string | undefined;
    query?: IBaseQuery | undefined;
    maxDepth?: number | undefined;
    onChange: (query?: IBaseQuery) => void;
} & import("react").RefAttributes<IBaseQueryBuilderRef>>;
