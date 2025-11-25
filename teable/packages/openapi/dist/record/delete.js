"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecord = exports.DeleteRecordRoute = exports.DELETE_RECORD_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_RECORD_URL = '/table/{tableId}/record/{recordId}';
exports.DeleteRecordRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_RECORD_URL,
    summary: 'Delete record',
    description: 'Permanently delete a single record by its ID.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Deleted successfully',
        },
    },
    tags: ['record'],
});
async function deleteRecord(tableId, recordId) {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_RECORD_URL, { tableId, recordId }));
}
exports.deleteRecord = deleteRecord;
