"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permanentDeleteTable = exports.PermanentDeleteTableRoute = exports.PERMANENT_DELETE_TABLE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PERMANENT_DELETE_TABLE = '/base/{baseId}/table/{tableId}/permanent';
exports.PermanentDeleteTableRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.PERMANENT_DELETE_TABLE,
    summary: 'Permanently delete table',
    description: 'Permanently delete a table and all its data. This action cannot be undone.',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Table and all associated data permanently deleted.',
        },
    },
    tags: ['table'],
});
const permanentDeleteTable = async (baseId, tableId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.PERMANENT_DELETE_TABLE, {
        baseId,
        tableId,
    }));
};
exports.permanentDeleteTable = permanentDeleteTable;
