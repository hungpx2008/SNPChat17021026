"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableById = exports.GetTableRoute = exports.GET_TABLE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.GET_TABLE = '/base/{baseId}/table/{tableId}';
exports.GetTableRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TABLE,
    summary: 'Get table details',
    description: 'Retrieve detailed information about a specific table, including its schema, name, and configuration.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns data about a table.',
            content: {
                'application/json': {
                    schema: create_1.tableVoSchema,
                },
            },
        },
    },
    tags: ['table'],
});
const getTableById = async (baseId, tableId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_TABLE, {
        baseId,
        tableId,
    }));
};
exports.getTableById = getTableById;
