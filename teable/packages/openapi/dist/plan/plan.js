"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planField = exports.planFieldRoute = exports.planFieldVoSchema = exports.graphVoSchema = exports.graphComboSchema = exports.graphEdgeSchema = exports.graphNodeSchema = exports.PLAN_FIELD = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLAN_FIELD = '/table/{tableId}/field/{fieldId}/plan';
exports.graphNodeSchema = zod_1.z
    .object({
    id: zod_1.z.string(),
    label: zod_1.z.string().optional(),
    comboId: zod_1.z.string().optional(),
})
    .passthrough();
exports.graphEdgeSchema = zod_1.z
    .object({
    source: zod_1.z.string(),
    target: zod_1.z.string(),
    label: zod_1.z.string().optional(),
})
    .passthrough();
exports.graphComboSchema = zod_1.z
    .object({
    id: zod_1.z.string(),
    label: zod_1.z.string(),
})
    .passthrough();
exports.graphVoSchema = zod_1.z
    .object({
    nodes: zod_1.z.array(exports.graphNodeSchema),
    edges: zod_1.z.array(exports.graphEdgeSchema),
    combos: zod_1.z.array(exports.graphComboSchema),
})
    .optional();
exports.planFieldVoSchema = zod_1.z.object({
    estimateTime: zod_1.z.number(),
    graph: exports.graphVoSchema,
    updateCellCount: zod_1.z.number(),
    linkFieldCount: zod_1.z.number().optional(),
});
exports.planFieldRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.PLAN_FIELD,
    description: 'Generate calculation plan for the field',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the calculation plan for the field',
            content: {
                'application/json': {
                    schema: exports.planFieldVoSchema,
                },
            },
        },
    },
    tags: ['plan'],
});
const planField = async (tableId, fieldId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.PLAN_FIELD, {
        tableId,
        fieldId,
    }));
};
exports.planField = planField;
