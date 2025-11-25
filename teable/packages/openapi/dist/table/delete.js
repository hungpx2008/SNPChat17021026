"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTable = exports.DeleteTableRoute = exports.DELETE_TABLE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_TABLE = '/base/{baseId}/table/{tableId}';
exports.DeleteTableRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_TABLE,
    summary: 'Delete table',
    description: 'Move a table to trash. The table can be restored within the retention period.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Table successfully moved to trash.',
        },
    },
    tags: ['table'],
});
const deleteTable = async (baseId, tableId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_TABLE, {
        baseId,
        tableId,
    }));
};
exports.deleteTable = deleteTable;
