import type { IViewActionKey } from '@teable/core';
export declare const useViewListener: (viewId: string | undefined, matches: IViewActionKey[], cb: (actionKey: string, payload?: any) => void) => void;
