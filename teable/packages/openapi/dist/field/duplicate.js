"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateField = exports.DuplicateFieldRoute = exports.duplicateFieldRoSchema = exports.DUPLICATE_FIELD = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DUPLICATE_FIELD = '/table/{tableId}/field/{fieldId}/duplicate';
exports.duplicateFieldRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
    viewId: zod_1.z.string().optional(),
});
exports.DuplicateFieldRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.DUPLICATE_FIELD,
    summary: 'Duplicate field',
    description: 'Duplicate field',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.duplicateFieldRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns duplicated field data',
            content: {
                'application/json': {
                    schema: core_1.fieldVoSchema,
                },
            },
        },
    },
    tags: ['field'],
});
const duplicateField = async (tableId, fieldId, duplicateFieldRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.DUPLICATE_FIELD, { tableId, fieldId }), duplicateFieldRo);
};
exports.duplicateField = duplicateField;
