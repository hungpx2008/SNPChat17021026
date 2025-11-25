import type ReconnectingWebSocket from 'reconnecting-websocket';
export declare const isConnected: (socket: ReconnectingWebSocket) => boolean;
export declare const useConnectionAutoManage: (connection: ReconnectingWebSocket | null, reconnect: () => void, { inactiveTimeout, reconnectDelay, }?: {
    inactiveTimeout?: number | undefined;
    reconnectDelay?: number | undefined;
}) => void;
