import type { Doc } from 'sharedb/lib/client';
export declare class OpListenersManager<T> {
    private opListeners;
    private collection;
    constructor(collection: string);
    add(doc: Doc<T>, handler: (op: unknown[]) => void): void;
    remove(doc: Doc<T>): void;
    clear(): void;
}
