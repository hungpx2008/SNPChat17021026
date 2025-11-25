"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDbTableName = exports.updateDbTableNameRoute = exports.dbTableNameRoSchema = exports.DB_TABLE_NAME = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DB_TABLE_NAME = '/base/{baseId}/table/{tableId}/db-table-name';
exports.dbTableNameRoSchema = zod_1.z.object({
    dbTableName: zod_1.z
        .string()
        .min(1, { message: 'Table name cannot be empty' })
        .regex(/^[a-z_]\w{0,62}$/i, {
        message: 'Invalid name format',
    })
        .openapi({
        description: 'table name in backend database. Limitation: 1-63 characters, start with letter or underscore, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing table name in the base.',
    }),
});
exports.updateDbTableNameRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.DB_TABLE_NAME,
    summary: 'Update db table name',
    description: 'Update the physical database table name. Must be 1-63 characters, start with letter or underscore, contain only letters, numbers and underscore, and be unique within the base.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.dbTableNameRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Database table name successfully updated.',
        },
    },
    tags: ['table'],
});
const updateDbTableName = async (baseId, tableId, data) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.DB_TABLE_NAME, {
        baseId,
        tableId,
    }), data);
};
exports.updateDbTableName = updateDbTableName;
