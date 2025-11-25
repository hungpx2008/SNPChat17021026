"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteField = exports.DeleteFieldRoute = exports.DELETE_FIELD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_FIELD = '/table/{tableId}/field/{fieldId}';
exports.DeleteFieldRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_FIELD,
    summary: 'Delete field',
    description: 'Permanently remove a field from the specified table',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Deleted successfully',
        },
    },
    tags: ['field'],
});
const deleteField = async (tableId, fieldId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_FIELD, {
        tableId,
        fieldId,
    }));
};
exports.deleteField = deleteField;
