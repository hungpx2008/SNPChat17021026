"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonClick = exports.ButtonClickRoute = exports.buttonClickVoSchema = exports.BUTTON_CLICK = void 0;
const core_1 = require("@teable/core");
const zod_1 = require("zod");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.BUTTON_CLICK = '/table/{tableId}/record/{recordId}/{fieldId}/button-click';
exports.buttonClickVoSchema = zod_1.z.object({
    runId: zod_1.z.string(),
    tableId: zod_1.z.string(),
    fieldId: zod_1.z.string(),
    record: core_1.recordSchema,
});
exports.ButtonClickRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.BUTTON_CLICK,
    summary: 'Button click',
    description: 'Button click',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the clicked cell',
            content: {
                'application/json': {
                    schema: exports.buttonClickVoSchema,
                },
            },
        },
    },
    tags: ['record'],
});
async function buttonClick(tableId, recordId, fieldId) {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.BUTTON_CLICK, { tableId, recordId, fieldId }));
}
exports.buttonClick = buttonClick;
