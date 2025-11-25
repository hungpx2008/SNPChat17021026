"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableAbnormalIndex = exports.TableAbnormalIndexRoute = exports.getAbnormalVoSchema = exports.TABLE_ABNORMAL_INDEX = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const toggle_table_index_1 = require("./toggle-table-index");
exports.TABLE_ABNORMAL_INDEX = '/base/{baseId}/table/{tableId}/abnormal-index';
exports.getAbnormalVoSchema = zod_1.z
    .object({
    indexName: zod_1.z.string(),
})
    .array();
exports.TableAbnormalIndexRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.TABLE_ABNORMAL_INDEX,
    summary: 'Get abnormal indexes',
    description: 'Retrieve a list of abnormal database indexes for a specific table by index type. This helps identify potential performance or maintenance issues.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
            type: toggle_table_index_1.tableIndexTypeSchema,
        }),
    },
    responses: {
        201: {
            description: 'Successfully retrieved list of abnormal indexes.',
            content: {
                'application/json': {
                    schema: exports.getAbnormalVoSchema,
                },
            },
        },
    },
    tags: ['table'],
});
const getTableAbnormalIndex = (baseId, tableId, type) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.TABLE_ABNORMAL_INDEX, { baseId, tableId }), {
        params: { type },
    });
};
exports.getTableAbnormalIndex = getTableAbnormalIndex;
