"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTableName = exports.updateTableNameRoute = exports.tableNameRoSchema = exports.TABLE_NAME = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.TABLE_NAME = '/base/{baseId}/table/{tableId}/name';
exports.tableNameRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.updateTableNameRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.TABLE_NAME,
    summary: 'Update table name',
    description: 'Update the display name of a table. This will not affect the underlying database table name.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.tableNameRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Table name successfully updated.',
        },
    },
    tags: ['table'],
});
const updateTableName = async (baseId, tableId, data) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.TABLE_NAME, {
        baseId,
        tableId,
    }), data);
};
exports.updateTableName = updateTableName;
