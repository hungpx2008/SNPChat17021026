"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonReset = exports.ButtonResetRoute = exports.BUTTON_RESET = void 0;
const core_1 = require("@teable/core");
const zod_1 = require("zod");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.BUTTON_RESET = '/table/{tableId}/record/{recordId}/{fieldId}/button-reset';
exports.ButtonResetRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.BUTTON_RESET,
    summary: 'Button reset',
    description: 'Button reset',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the reset cell',
            content: {
                'application/json': {
                    schema: core_1.recordSchema,
                },
            },
        },
    },
    tags: ['record'],
});
async function buttonReset(tableId, recordId, fieldId) {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.BUTTON_RESET, { tableId, recordId, fieldId }));
}
exports.buttonReset = buttonReset;
