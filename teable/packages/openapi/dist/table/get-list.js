"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableList = exports.GetTableListRoute = exports.GET_TABLE_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.GET_TABLE_LIST = '/base/{baseId}/table';
exports.GetTableListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TABLE_LIST,
    summary: 'List tables',
    description: 'Retrieve a list of all tables in the specified base, including their basic information and configurations.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successfully retrieved the list of tables.',
            content: {
                'application/json': {
                    schema: create_1.tableListVoSchema,
                },
            },
        },
    },
    tags: ['table'],
});
const getTableList = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_TABLE_LIST, { baseId }));
};
exports.getTableList = getTableList;
