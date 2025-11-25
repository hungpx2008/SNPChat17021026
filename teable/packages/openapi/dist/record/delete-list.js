"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecords = exports.DeleteRecordsRoute = exports.deleteRecordsQuerySchema = exports.DELETE_RECORDS_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_RECORDS_URL = '/table/{tableId}/record';
exports.deleteRecordsQuerySchema = zod_1.z.object({
    recordIds: zod_1.z.array(zod_1.z.string()),
});
exports.DeleteRecordsRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_RECORDS_URL,
    summary: 'Delete records',
    description: 'Permanently delete multiple records by their IDs in a single request.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: exports.deleteRecordsQuerySchema,
    },
    responses: {
        200: {
            description: 'Deleted successfully',
        },
    },
    tags: ['record'],
});
// Function overloads for deleteRecords
async function deleteRecords(tableId, recordIds) {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_RECORDS_URL, { tableId }), {
        params: { recordIds },
    });
}
exports.deleteRecords = deleteRecords;
