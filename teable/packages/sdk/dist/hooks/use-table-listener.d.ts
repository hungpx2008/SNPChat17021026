import type { ITableActionKey } from '@teable/core';
export declare const useTableListener: (tableId: string | undefined, matches: ITableActionKey[], cb: (actionKey: string, payload?: any) => void) => void;
