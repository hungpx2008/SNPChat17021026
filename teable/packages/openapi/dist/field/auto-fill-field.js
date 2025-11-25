"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoFillField = exports.AutoFillFieldRoute = exports.autoFillFieldVoSchema = exports.autoFillFieldRoSchema = exports.AUTO_FILL_FIELD = void 0;
const zod_1 = require("zod");
const axios_1 = require("../axios");
const record_1 = require("../record");
const utils_1 = require("../utils");
exports.AUTO_FILL_FIELD = '/table/{tableId}/field/{fieldId}/auto-fill';
exports.autoFillFieldRoSchema = record_1.contentQueryBaseSchema.pick({
    viewId: true,
    filter: true,
    orderBy: true,
    groupBy: true,
    ignoreViewQuery: true,
});
exports.autoFillFieldVoSchema = zod_1.z.object({
    taskId: zod_1.z.string().nullable().optional(),
});
exports.AutoFillFieldRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.AUTO_FILL_FIELD,
    summary: 'Auto-fill a field by AI',
    description: 'Automatically generate suggestions for filling a specific field',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.autoFillFieldRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns the task ID for the auto-fill process',
            content: {
                'application/json': {
                    schema: exports.autoFillFieldVoSchema,
                },
            },
        },
    },
    tags: ['field'],
});
async function autoFillField(tableId, fieldId, query) {
    const serializedQuery = {
        ...query,
        filter: query?.filter ? JSON.stringify(query.filter) : undefined,
        orderBy: query?.orderBy ? JSON.stringify(query.orderBy) : undefined,
    };
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.AUTO_FILL_FIELD, { tableId, fieldId }), serializedQuery);
}
exports.autoFillField = autoFillField;
