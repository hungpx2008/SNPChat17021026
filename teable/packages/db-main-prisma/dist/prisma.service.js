"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nanoid_1 = require("nanoid");
const utils_1 = require("./utils");
function proxyClient(tx) {
    return new Proxy(tx, {
        get(target, p) {
            if (p === '$queryRawUnsafe' || p === '$executeRawUnsafe') {
                return async function (query, ...args) {
                    try {
                        return await target[p](query, ...args);
                    }
                    catch (e) {
                        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2028') {
                            throw new utils_1.TimeoutHttpException();
                        }
                        throw e;
                    }
                };
            }
            return target[p];
        },
    });
}
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    cls;
    logger = new common_1.Logger(PrismaService_1.name);
    afterTxCb;
    // Default transaction options from environment variables
    // Prisma's built-in defaults: timeout=5000ms, maxWait=2000ms
    defaultTxTimeout = PrismaService_1.parseOrDefault(process.env.PRISMA_TRANSACTION_TIMEOUT, process.env.NODE_ENV === 'production' ? 5000 : 20000);
    defaultTxMaxWait = PrismaService_1.parseOrDefault(process.env.PRISMA_TRANSACTION_MAX_WAIT, process.env.NODE_ENV === 'production' ? 2000 : 5000);
    constructor(cls) {
        const logConfig = {
            log: [
                // {
                //   level: 'query',
                //   emit: 'event',
                // },
                {
                    level: 'error',
                    emit: 'stdout',
                },
                // {
                //   level: 'info',
                //   emit: 'stdout',
                // },
                // {
                //   level: 'warn',
                //   emit: 'stdout',
                // },
            ],
        };
        const initialConfig = process.env.NODE_ENV === 'production' ? {} : { ...logConfig };
        super(initialConfig);
        this.cls = cls;
        // Log transaction timeout configuration on startup (must be after super())
        console.log(`[PrismaService] Transaction defaults: timeout=${this.defaultTxTimeout}ms, maxWait=${this.defaultTxMaxWait}ms (from env: PRISMA_TRANSACTION_TIMEOUT=${process.env.PRISMA_TRANSACTION_TIMEOUT}, PRISMA_TRANSACTION_MAX_WAIT=${process.env.PRISMA_TRANSACTION_MAX_WAIT})`);
    }
    static parseOrDefault(value, fallback) {
        const parsed = Number(value);
        if (Number.isFinite(parsed) && parsed > 0) {
            return parsed;
        }
        return fallback;
    }
    bindAfterTransaction(fn) {
        this.afterTxCb = fn;
    }
    /**
     * Executes a transaction using the provided function and options.
     * If a transaction client is already defined in the current context, the function is executed using it.
     * Otherwise, a new transaction is created and the function is executed using it.
     * @param fn The function to execute within the transaction.
     * @param options The options to use when creating the transaction.
     * @returns The result of the executed function.
     */
    async $tx(fn, options) {
        let result = undefined;
        const txClient = this.cls.get('tx.client');
        if (txClient) {
            return await fn(txClient);
        }
        // Apply default timeout and maxWait from environment if not explicitly provided
        const txOptions = {
            timeout: options?.timeout ?? this.defaultTxTimeout,
            maxWait: options?.maxWait ?? this.defaultTxMaxWait,
            ...(options?.isolationLevel && { isolationLevel: options.isolationLevel }),
        };
        await this.cls.runWith(this.cls.get(), async () => {
            result = await super.$transaction(async (prisma) => {
                prisma = proxyClient(prisma);
                this.cls.set('tx.client', prisma);
                this.cls.set('tx.id', (0, nanoid_1.nanoid)());
                this.cls.set('tx.timeStr', new Date().toISOString());
                try {
                    // can not delete await here
                    return await fn(prisma);
                }
                finally {
                    this.cls.set('tx.client', undefined);
                    this.cls.set('tx.id', undefined);
                    this.cls.set('tx.timeStr', undefined);
                }
            }, txOptions);
            this.afterTxCb?.();
        });
        return result;
    }
    txClient() {
        const txClient = this.cls.get('tx.client');
        if (!txClient) {
            // console.log('transactionId', 'none');
            return this;
        }
        // const id = this.cls.get('tx.id');
        // console.log('transactionId', id);
        return txClient;
    }
    async onModuleInit() {
        await this.$connect();
        if (process.env.NODE_ENV === 'production')
            return;
        this.$on('query', async (e) => {
            this.logger.debug({
                // Query: e.query.trim().replace(/\s+/g, ' ').replace(/\( /g, '(').replace(/ \)/g, ')'),
                Query: e.query,
                Params: e.params,
                Duration: `${e.duration} ms`,
            });
        });
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
