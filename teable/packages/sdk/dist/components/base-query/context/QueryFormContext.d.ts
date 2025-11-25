/// <reference types="react" />
import type { QuerySortedKeys } from '../constant';
export type IQueryValidatorKey = (typeof QuerySortedKeys)[number] | 'from';
export interface IQueryFormContext {
    validators: Record<IQueryValidatorKey, (() => boolean) | undefined>;
    registerValidator: (key: IQueryValidatorKey, fn?: () => boolean) => void;
}
export declare const QueryFormContext: import("react").Context<IQueryFormContext>;
