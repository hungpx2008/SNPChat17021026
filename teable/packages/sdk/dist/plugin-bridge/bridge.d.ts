import type { IBridgeListener, IChildBridgeMethods } from './types';
type IListenerKeys = keyof IChildBridgeMethods;
export declare class PluginBridge implements IBridgeListener {
    private connection;
    private bridge?;
    private listeners;
    constructor();
    init(): Promise<{
        on: <T extends keyof IChildBridgeMethods>(event: T, callback: IChildBridgeMethods[T]) => void;
        removeListener: <T_1 extends keyof IChildBridgeMethods>(event: T_1, listener: IChildBridgeMethods[T_1]) => void;
        removeAllListeners: <T_2 extends keyof IChildBridgeMethods>(event?: T_2 | undefined) => void;
        destroy: () => void;
        expandRecord: (recordIds: string[]) => Promise<void>;
        expandPlugin: () => Promise<void>;
        updateStorage: (storage?: Record<string, unknown> | undefined) => Promise<Record<string, unknown>>;
        getAuthCode: () => Promise<string>;
        getSelfTempToken: () => Promise<{
            accessToken: string;
            expiresTime: string;
        }>;
        getSelectionRecords: (selection: import("./types").ISelection, options?: {
            skip?: number | undefined;
            take?: number | undefined;
        } | undefined) => Promise<import("./types").IGetSelectionRecordsVo>;
    }>;
    on<T extends IListenerKeys>(event: T, callback: IChildBridgeMethods[T]): void;
    removeListener<T extends IListenerKeys>(event: T, listener: IChildBridgeMethods[T]): void;
    removeAllListeners<T extends IListenerKeys>(event?: T): void;
    destroy(): void;
}
export declare const initializeBridge: () => Promise<{
    on: <T extends keyof IChildBridgeMethods>(event: T, callback: IChildBridgeMethods[T]) => void;
    removeListener: <T_1 extends keyof IChildBridgeMethods>(event: T_1, listener: IChildBridgeMethods[T_1]) => void;
    removeAllListeners: <T_2 extends keyof IChildBridgeMethods>(event?: T_2 | undefined) => void;
    destroy: () => void;
    expandRecord: (recordIds: string[]) => Promise<void>;
    expandPlugin: () => Promise<void>;
    updateStorage: (storage?: Record<string, unknown> | undefined) => Promise<Record<string, unknown>>;
    getAuthCode: () => Promise<string>;
    getSelfTempToken: () => Promise<{
        accessToken: string;
        expiresTime: string;
    }>;
    getSelectionRecords: (selection: import("./types").ISelection, options?: {
        skip?: number | undefined;
        take?: number | undefined;
    } | undefined) => Promise<import("./types").IGetSelectionRecordsVo>;
} | undefined>;
export {};
