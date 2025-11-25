"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFields = exports.GetFieldListRoute = exports.GET_FIELD_LIST = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_FIELD_LIST = '/table/{tableId}/field';
exports.GetFieldListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_FIELD_LIST,
    summary: 'List fields',
    description: 'Retrieve a list of fields in a table with optional filtering',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: core_1.getFieldsQuerySchema,
    },
    responses: {
        200: {
            description: 'Returns the list of field.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(core_1.fieldVoSchema),
                },
            },
        },
    },
    tags: ['field'],
});
async function getFields(tableId, query) {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_FIELD_LIST, { tableId }), {
        params: query,
    });
}
exports.getFields = getFields;
