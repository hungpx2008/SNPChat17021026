"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redo = exports.RedoRoute = exports.redoVoSchema = exports.OPERATION_REDO = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const undo_1 = require("./undo");
exports.OPERATION_REDO = '/table/{tableId}/undo-redo/redo';
exports.redoVoSchema = undo_1.undoVoSchema;
exports.RedoRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.OPERATION_REDO,
    description: 'Redo the last operation',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Returns data about the redo operation.',
            content: {
                'application/json': {
                    schema: exports.redoVoSchema,
                },
            },
        },
    },
    tags: ['record'],
});
async function redo(tableId) {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.OPERATION_REDO, { tableId }));
}
exports.redo = redo;
