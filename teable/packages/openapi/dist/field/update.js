"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateField = exports.UpdateFieldRoute = exports.UPDATE_FIELD = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_FIELD = '/table/{tableId}/field/{fieldId}';
exports.UpdateFieldRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_FIELD,
    summary: 'Update field',
    description: 'Update common properties of a field (name, description, dbFieldName). For other property changes, use the convert field API',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.updateFieldRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Updated Successfully',
        },
    },
    tags: ['field'],
});
const updateField = async (tableId, fieldId, fieldRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_FIELD, {
        tableId,
        fieldId,
    }), fieldRo);
};
exports.updateField = updateField;
