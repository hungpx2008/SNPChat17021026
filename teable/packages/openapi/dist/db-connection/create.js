"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDbConnection = exports.CreateDbConnectionRoute = exports.dbConnectionVoSchema = exports.createDbConnectionRoSchema = exports.CREATE_DB_CONNECTION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CREATE_DB_CONNECTION = '/base/{baseId}/connection';
exports.createDbConnectionRoSchema = zod_1.z.object({
    baseId: zod_1.z.string(),
});
exports.dbConnectionVoSchema = zod_1.z.object({
    dsn: zod_1.z.object({
        driver: zod_1.z.string(),
        host: zod_1.z.string(),
        port: zod_1.z.number().optional(),
        db: zod_1.z.string().optional(),
        user: zod_1.z.string().optional(),
        pass: zod_1.z.string().optional(),
        params: zod_1.z.record(zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()])).optional(),
    }),
    connection: zod_1.z.object({
        max: zod_1.z.number(),
        current: zod_1.z.number(),
    }),
    url: zod_1.z.string().openapi({ description: 'The URL that can be used to connect to the database' }),
});
exports.CreateDbConnectionRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_DB_CONNECTION,
    description: 'Create a db connection url',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.createDbConnectionRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Connection created successfully',
            content: {
                'application/json': {
                    schema: exports.dbConnectionVoSchema.nullable(),
                },
            },
        },
    },
    tags: ['db-connection'],
});
const createDbConnection = async (baseId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_DB_CONNECTION, { baseId }));
};
exports.createDbConnection = createDbConnection;
