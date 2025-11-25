import { Connection } from 'sharedb/lib/client';
export declare function getWsPath(): string;
export declare const useConnection: (path?: string) => {
    connection: Connection | undefined;
    connected: boolean;
};
