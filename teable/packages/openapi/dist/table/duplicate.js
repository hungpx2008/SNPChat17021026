"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateTable = exports.DuplicateTableRoute = exports.duplicateTableVoSchema = exports.duplicateTableRoSchema = exports.DUPLICATE_TABLE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.DUPLICATE_TABLE = '/base/{baseId}/table/{tableId}/duplicate';
exports.duplicateTableRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    includeRecords: zod_1.z.boolean(),
});
exports.duplicateTableVoSchema = create_1.tableFullVoSchema
    .omit({
    records: true,
})
    .extend({
    viewMap: zod_1.z.record(zod_1.z.string()),
    fieldMap: zod_1.z.record(zod_1.z.string()),
});
exports.DuplicateTableRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.DUPLICATE_TABLE,
    description: 'Duplicate a table',
    summary: 'Duplicate a table',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.duplicateTableRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Duplicate successfully',
        },
    },
    tags: ['table'],
});
const duplicateTable = async (baseId, tableId, duplicateRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.DUPLICATE_TABLE, {
        baseId,
        tableId,
    }), duplicateRo);
};
exports.duplicateTable = duplicateTable;
