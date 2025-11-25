"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecords = exports.UpdateRecordsRoute = exports.UPDATE_RECORDS = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const update_1 = require("./update");
exports.UPDATE_RECORDS = '/table/{tableId}/record';
exports.UpdateRecordsRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_RECORDS,
    summary: 'Update multiple records',
    description: 'Update multiple records in a single request with support for field value typecast and record reordering.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: update_1.updateRecordsRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns the records data after update.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(core_1.recordSchema),
                },
            },
        },
    },
    tags: ['record'],
});
async function updateRecords(tableId, recordsRo) {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_RECORDS, { tableId }), recordsRo);
}
exports.updateRecords = updateRecords;
