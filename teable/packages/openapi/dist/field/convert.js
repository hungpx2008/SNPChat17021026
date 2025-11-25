"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertField = exports.ConvertFieldRoute = exports.CONVERT_FIELD = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CONVERT_FIELD = '/table/{tableId}/field/{fieldId}/convert';
exports.ConvertFieldRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.CONVERT_FIELD,
    summary: 'Convert field type',
    description: 'Convert field to a different type with automatic type casting and symmetric field handling',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.convertFieldRoSchema.openapi({
                        description: 'Provide the complete field configuration including all properties, modified or not',
                    }),
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns field data after update.',
            content: {
                'application/json': {
                    schema: core_1.fieldVoSchema,
                },
            },
        },
    },
    tags: ['field'],
});
const convertField = async (tableId, fieldId, fieldRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.CONVERT_FIELD, {
        tableId,
        fieldId,
    }), fieldRo);
};
exports.convertField = convertField;
