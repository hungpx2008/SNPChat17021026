import type { parseDsnOrThrow } from '@httpx/dsn-parser';
export type IDsn = ReturnType<typeof parseDsnOrThrow>;
export declare function parseDsn(dsn: string): IDsn;
export declare function isParsableDsn(dsn: unknown): boolean;
export declare enum DriverClient {
    Pg = "postgresql",
    Sqlite = "sqlite3"
}
