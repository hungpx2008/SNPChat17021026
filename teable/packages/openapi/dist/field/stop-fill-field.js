"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopFillField = exports.StopFillFieldRoute = exports.STOP_FILL_FIELD = void 0;
const zod_1 = require("zod");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.STOP_FILL_FIELD = '/table/{tableId}/field/{fieldId}/stop-fill';
exports.StopFillFieldRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.STOP_FILL_FIELD,
    summary: 'Stop auto-fill a field by AI',
    description: 'Stop auto-fill a field by AI',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Stop auto-fill a field by AI successfully',
        },
    },
    tags: ['field'],
});
async function stopFillField(tableId, fieldId) {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.STOP_FILL_FIELD, { tableId, fieldId }));
}
exports.stopFillField = stopFillField;
