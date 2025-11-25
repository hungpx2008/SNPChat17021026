"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createField = exports.CreateFieldRoute = exports.CREATE_FIELD = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CREATE_FIELD = '/table/{tableId}/field';
exports.CreateFieldRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_FIELD,
    summary: 'Create field',
    description: 'Create a new field in the specified table with the given configuration',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.createFieldRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
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
const createField = async (tableId, fieldRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_FIELD, { tableId }), fieldRo);
};
exports.createField = createField;
