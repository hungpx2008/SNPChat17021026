"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getField = exports.GetFieldRoute = exports.GET_FIELD = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_FIELD = '/table/{tableId}/field/{fieldId}';
exports.GetFieldRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_FIELD,
    summary: 'Get a field',
    description: 'Retrieve detailed information about a specific field by its ID',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns data about a field.',
            content: {
                'application/json': {
                    schema: core_1.fieldVoSchema,
                },
            },
        },
    },
    tags: ['field'],
});
async function getField(tableId, fieldId) {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_FIELD, { tableId, fieldId }));
}
exports.getField = getField;
