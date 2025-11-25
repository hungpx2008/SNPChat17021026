"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planFieldConvert = exports.planFieldConvertRoute = exports.planFieldConvertVoSchema = exports.PLAN_FIELD_CONVERT = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const plan_1 = require("./plan");
exports.PLAN_FIELD_CONVERT = '/table/{tableId}/field/{fieldId}/plan';
exports.planFieldConvertVoSchema = plan_1.planFieldVoSchema.partial().merge(zod_1.z.object({
    skip: zod_1.z.boolean().optional(),
}));
exports.planFieldConvertRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.PLAN_FIELD_CONVERT,
    description: 'Generate calculation plan for converting the field',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.convertFieldRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns the calculation plan',
            content: {
                'application/json': {
                    schema: exports.planFieldConvertVoSchema,
                },
            },
        },
    },
    tags: ['plan'],
});
const planFieldConvert = async (tableId, fieldId, fieldRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.PLAN_FIELD_CONVERT, {
        tableId,
        fieldId,
    }), fieldRo);
};
exports.planFieldConvert = planFieldConvert;
