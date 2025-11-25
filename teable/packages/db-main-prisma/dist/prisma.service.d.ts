import type { OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import type { ClsService } from 'nestjs-cls';
interface ITx {
    client?: Prisma.TransactionClient;
    timeStr?: string;
    id?: string;
    rawOpMaps?: unknown;
}
export declare class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query'> implements OnModuleInit {
    private readonly cls;
    private readonly logger;
    private afterTxCb?;
    private readonly defaultTxTimeout;
    private readonly defaultTxMaxWait;
    constructor(cls: ClsService<{
        tx: ITx;
    }>);
    private static parseOrDefault;
    bindAfterTransaction(fn: () => void): void;
    /**
     * Executes a transaction using the provided function and options.
     * If a transaction client is already defined in the current context, the function is executed using it.
     * Otherwise, a new transaction is created and the function is executed using it.
     * @param fn The function to execute within the transaction.
     * @param options The options to use when creating the transaction.
     * @returns The result of the executed function.
     */
    $tx<R = unknown>(fn: (prisma: Prisma.TransactionClient) => Promise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): Promise<R>;
    txClient(): Prisma.TransactionClient;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
export {};
