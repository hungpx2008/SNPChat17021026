"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoFillCell = exports.AutoFillCellRoute = exports.autoFillCellVoSchema = exports.AUTO_FILL_CELL = void 0;
const zod_1 = require("zod");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.AUTO_FILL_CELL = '/table/{tableId}/record/{recordId}/{fieldId}/auto-fill';
exports.autoFillCellVoSchema = zod_1.z.object({
    taskId: zod_1.z.string(),
});
exports.AutoFillCellRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.AUTO_FILL_CELL,
    summary: 'Auto-fill a cell by AI',
    description: 'Automatically fill a cell in a specific record and field',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the updated record status',
            content: {
                'application/json': {
                    schema: zod_1.z.object({
                        status: zod_1.z.string(),
                    }),
                },
            },
        },
    },
    tags: ['record'],
});
async function autoFillCell(tableId, recordId, fieldId) {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.AUTO_FILL_CELL, { tableId, recordId, fieldId }));
}
exports.autoFillCell = autoFillCell;
