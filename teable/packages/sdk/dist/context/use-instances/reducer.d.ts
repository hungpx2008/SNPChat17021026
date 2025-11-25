import type { Doc } from 'sharedb/lib/client';
export type IInstanceAction<T> = {
    type: 'update';
    doc: Doc<T>;
} | {
    type: 'ready';
    results: Doc<T>[];
    extra: unknown;
} | {
    type: 'insert';
    docs: Doc<T>[];
    index: number;
} | {
    type: 'remove';
    docs: Doc<T>[];
    index: number;
} | {
    type: 'move';
    docs: Doc<T>[];
    from: number;
    to: number;
} | {
    type: 'clear';
} | {
    type: 'extra';
    extra: unknown;
};
export interface IInstanceState<R> {
    instances: R[];
    extra: unknown;
}
export declare function instanceReducer<T, R extends {
    id: string;
}>(state: IInstanceState<R>, action: IInstanceAction<T>, factory: (data: T, doc?: Doc<T>) => R): IInstanceState<R>;
