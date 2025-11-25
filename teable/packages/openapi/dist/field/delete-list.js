"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFields = exports.DeleteFieldListRoute = exports.deleteFieldsQuerySchema = exports.DELETE_FIELD_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_FIELD_LIST = '/table/{tableId}/field';
exports.deleteFieldsQuerySchema = zod_1.z.object({
    fieldIds: zod_1.z.array(zod_1.z.string()),
});
exports.DeleteFieldListRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_FIELD_LIST,
    summary: 'Delete multiple fields',
    description: 'Permanently remove multiple fields from the specified table',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: exports.deleteFieldsQuerySchema,
    },
    responses: {
        200: {
            description: 'Deleted successfully',
        },
    },
    tags: ['field'],
});
const deleteFields = async (tableId, fieldIds) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_FIELD_LIST, {
        tableId,
    }), {
        params: {
            fieldIds,
        },
    });
};
exports.deleteFields = deleteFields;
