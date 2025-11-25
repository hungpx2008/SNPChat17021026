import type { Doc } from 'sharedb/lib/client';
import type { IInstanceState } from './reducer';
export interface IUseInstancesProps<T, R> {
    collection: string;
    initData?: T[];
    factory: (data: T, doc?: Doc<T>) => R;
    queryParams: unknown;
}
/**
 * Manage instances of a collection, auto subscribe the update and change event, auto create instance,
 * keep every instance the latest data
 * @returns instance[]
 */
export declare function useInstances<T, R extends {
    id: string;
}>({ collection, factory, queryParams, initData, }: IUseInstancesProps<T, R>): IInstanceState<R>;
