"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbConnection = exports.GetDbConnectionRoute = exports.GET_DB_CONNECTION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.GET_DB_CONNECTION = '/base/{baseId}/connection';
exports.GetDbConnectionRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_DB_CONNECTION,
    description: 'Get db connection info',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns information about a db connection.',
            content: {
                'application/json': {
                    schema: create_1.dbConnectionVoSchema.optional(),
                },
            },
        },
    },
    tags: ['db-connection'],
});
const getDbConnection = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_DB_CONNECTION, {
        baseId,
    }));
};
exports.getDbConnection = getDbConnection;
