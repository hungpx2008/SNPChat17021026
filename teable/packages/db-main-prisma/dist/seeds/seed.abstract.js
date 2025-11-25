"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSeed = void 0;
class AbstractSeed {
    prisma;
    driver;
    outLog;
    constructor(prisma, driver, outLog = false) {
        this.prisma = prisma;
        this.driver = driver;
        this.outLog = outLog;
    }
    log = (operation, msg) => {
        (process.env.CI || this.outLog) && console.log(`${operation}: ${msg}`);
    };
}
exports.AbstractSeed = AbstractSeed;
