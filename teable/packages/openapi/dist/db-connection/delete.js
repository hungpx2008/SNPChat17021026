"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDbConnection = exports.DeleteDbConnectionRoute = exports.DELETE_DB_CONNECTION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_DB_CONNECTION = '/base/{baseId}/connection';
exports.DeleteDbConnectionRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_DB_CONNECTION,
    description: 'Delete a db connection',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Deleted successfully',
        },
    },
    tags: ['db-connection'],
});
const deleteDbConnection = async (baseId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_DB_CONNECTION, {
        baseId,
    }));
};
exports.deleteDbConnection = deleteDbConnection;
