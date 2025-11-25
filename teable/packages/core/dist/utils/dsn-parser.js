"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverClient = exports.isParsableDsn = exports.parseDsn = void 0;
const dsn_parser_1 = require("@httpx/dsn-parser");
function parseDsn(dsn) {
    const parsedDsn = (0, dsn_parser_1.parseDsn)(dsn);
    if (dsn.startsWith('file:')) {
        return {
            host: 'localhost',
            driver: 'sqlite3',
        };
    }
    if (!parsedDsn.success) {
        throw new Error(`DATABASE_URL ${parsedDsn.reason}`);
    }
    if (!parsedDsn.value.port) {
        throw new Error(`DATABASE_URL must provide a port`);
    }
    return parsedDsn.value;
}
exports.parseDsn = parseDsn;
function isParsableDsn(dsn) {
    return dsn.startsWith('file:') || (0, dsn_parser_1.isParsableDsn)(dsn);
}
exports.isParsableDsn = isParsableDsn;
var DriverClient;
(function (DriverClient) {
    DriverClient["Pg"] = "postgresql";
    DriverClient["Sqlite"] = "sqlite3";
})(DriverClient || (exports.DriverClient = DriverClient = {}));
