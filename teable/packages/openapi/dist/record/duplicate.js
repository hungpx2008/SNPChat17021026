"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateRecord = exports.duplicateRoute = exports.DUPLICATE_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.DUPLICATE_URL = '/table/{tableId}/record/{recordId}/duplicate';
exports.duplicateRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.DUPLICATE_URL,
    summary: 'Duplicate record',
    description: 'Create a copy of an existing record with optional custom positioning in the view.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: create_1.recordInsertOrderRoSchema.optional(),
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successful duplicate',
            content: {
                'application/json': {
                    schema: create_1.createRecordsVoSchema,
                },
            },
        },
    },
    tags: ['record'],
});
const duplicateRecord = async (tableId, recordId, order) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.DUPLICATE_URL, { tableId, recordId }), order);
};
exports.duplicateRecord = duplicateRecord;
