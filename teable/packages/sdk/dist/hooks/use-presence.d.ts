import type { Presence } from 'sharedb/lib/sharedb';
export interface IActionData {
    actionKey: string;
    payload?: Record<string, unknown>;
}
export declare const usePresence: (channel: string | undefined) => Presence<any> | undefined;
export declare const useActionListener: <T extends IActionData>(tableIdOrViewId: string | undefined, matches: T['actionKey'][], callback: (actionKey: T['actionKey'], payload?: any) => void) => void;
