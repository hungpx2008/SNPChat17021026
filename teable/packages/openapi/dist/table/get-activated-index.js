"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableActivatedIndex = exports.TableActivatedIndexRoute = exports.TABLE_ACTIVATED_INDEX = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const toggle_table_index_1 = require("./toggle-table-index");
exports.TABLE_ACTIVATED_INDEX = '/base/{baseId}/table/{tableId}/activated-index';
exports.TableActivatedIndexRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.TABLE_ACTIVATED_INDEX,
    summary: 'Get activated index',
    description: 'Get the activated index of a table',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Returns table full text search index status',
            content: {
                'application/json': {
                    schema: toggle_table_index_1.tableIndexTypeSchema.array(),
                },
            },
        },
    },
    tags: ['table'],
});
const getTableActivatedIndex = (baseId, tableId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.TABLE_ACTIVATED_INDEX, { baseId, tableId }));
};
exports.getTableActivatedIndex = getTableActivatedIndex;
