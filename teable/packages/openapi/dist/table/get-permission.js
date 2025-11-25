"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTablePermission = exports.GetTablePermissionRoute = exports.tablePermissionVoSchema = exports.GET_TABLE_PERMISSION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_TABLE_PERMISSION = '/base/{baseId}/table/{tableId}/permission';
exports.tablePermissionVoSchema = zod_1.z.object({
    table: zod_1.z.record(zod_1.z.custom(), zod_1.z.boolean()),
    view: zod_1.z.record(zod_1.z.custom(), zod_1.z.boolean()),
    record: zod_1.z.record(zod_1.z.custom(), zod_1.z.boolean()),
    field: zod_1.z.record(zod_1.z.custom(), zod_1.z.boolean()),
});
exports.GetTablePermissionRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TABLE_PERMISSION,
    summary: 'Get table permissions',
    description: "Retrieve the current user's permissions for a table, including access rights for table operations, views, records, and fields.",
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Successfully retrieved table permissions for the current user.',
            content: {
                'application/json': {
                    schema: exports.tablePermissionVoSchema,
                },
            },
        },
    },
    tags: ['table'],
});
const getTablePermission = async (baseId, tableId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_TABLE_PERMISSION, {
        baseId,
        tableId,
    }));
};
exports.getTablePermission = getTablePermission;
