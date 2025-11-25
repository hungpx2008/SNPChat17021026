import type { PrismaClient } from '@prisma/client';
export declare abstract class AbstractSeed {
    prisma: PrismaClient;
    driver: 'postgresql' | 'sqlite3';
    outLog: boolean;
    constructor(prisma: PrismaClient, driver: 'postgresql' | 'sqlite3', outLog?: boolean);
    abstract execute(): Promise<void>;
    protected log: (operation: 'UPSERT' | 'CREATE' | 'UPDATE', msg: string) => void;
}
