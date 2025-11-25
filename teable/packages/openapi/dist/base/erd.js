"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseErd = exports.getBaseErdRoute = exports.baseErdVoSchema = exports.baseErdEdgeSchema = exports.baseErdTableNodeSchema = exports.BASE_ERD = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.BASE_ERD = '/base/{baseId}/erd';
exports.baseErdTableNodeSchema = zod_1.z
    .object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    icon: zod_1.z.string().optional(),
    crossBaseId: zod_1.z.string().optional(),
    crossBaseName: zod_1.z.string().optional(),
    fields: core_1.fieldVoSchema
        .pick({
        id: true,
        name: true,
        type: true,
        isLookup: true,
        isConditionalLookup: true,
        isPrimary: true,
    })
        .array(),
})
    .passthrough();
exports.baseErdEdgeSchema = zod_1.z.object({
    source: zod_1.z.object({
        tableId: zod_1.z.string(),
        tableName: zod_1.z.string(),
        fieldId: zod_1.z.string(),
        fieldName: zod_1.z.string(),
    }),
    target: zod_1.z.object({
        tableId: zod_1.z.string(),
        tableName: zod_1.z.string(),
        fieldId: zod_1.z.string(),
        fieldName: zod_1.z.string(),
    }),
    relationship: zod_1.z.nativeEnum(core_1.Relationship).optional(),
    isOneWay: zod_1.z.boolean().optional(),
    type: zod_1.z.nativeEnum(core_1.FieldType).or(zod_1.z.literal('lookup')),
});
exports.baseErdVoSchema = zod_1.z.object({
    baseId: zod_1.z.string(),
    nodes: zod_1.z.array(exports.baseErdTableNodeSchema),
    edges: zod_1.z.array(exports.baseErdEdgeSchema),
});
exports.getBaseErdRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.BASE_ERD,
    description: 'Get the erd of a base',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the erd of a base.',
            content: {
                'application/json': {
                    schema: exports.baseErdVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const getBaseErd = async (baseId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.BASE_ERD, { baseId }));
};
exports.getBaseErd = getBaseErd;
