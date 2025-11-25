"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undo = exports.UndoRoute = exports.undoVoSchema = exports.OPERATION_UNDO = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.OPERATION_UNDO = '/table/{tableId}/undo-redo/undo';
exports.undoVoSchema = zod_1.z.object({
    status: zod_1.z.enum(['fulfilled', 'failed', 'empty']),
    errorMessage: zod_1.z.string().optional(),
});
exports.UndoRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.OPERATION_UNDO,
    description: 'Undo the last operation',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Returns data about the undo operation.',
            content: {
                'application/json': {
                    schema: exports.undoVoSchema,
                },
            },
        },
    },
    tags: ['record'],
});
async function undo(tableId) {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.OPERATION_UNDO, { tableId }));
}
exports.undo = undo;
