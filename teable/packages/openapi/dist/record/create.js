"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecords = exports.CreateRecordRoute = exports.CREATE_RECORD = exports.createRecordsVoSchema = exports.createRecordsRoSchema = exports.recordInsertOrderRoSchema = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const get_1 = require("./get");
const get_list_1 = require("./get-list");
exports.recordInsertOrderRoSchema = zod_1.z
    .object({
    viewId: zod_1.z
        .string()
        .openapi({
        description: 'You can only specify order in one view when create record (will create a order index automatically)',
    })
        .describe('You can only specify order in one view when create record (will create a order index automatically)'),
    anchorId: zod_1.z
        .string()
        .openapi({
        description: 'The record id to anchor to',
    })
        .describe('The record id to anchor to'),
    position: zod_1.z.enum(['before', 'after']),
})
    .openapi({
    description: 'Where this record to insert to (Optional)',
});
exports.createRecordsRoSchema = zod_1.z
    .object({
    fieldKeyType: get_1.fieldKeyTypeRoSchema,
    typecast: get_1.typecastSchema,
    order: exports.recordInsertOrderRoSchema.optional(),
    records: zod_1.z
        .object({
        fields: core_1.recordSchema.shape.fields,
    })
        .array()
        .openapi({
        example: [
            {
                fields: {
                    'single line text': 'text value',
                },
            },
        ],
        description: 'Array of record objects ',
    }),
})
    .openapi({
    description: 'Multiple Create records',
});
exports.createRecordsVoSchema = get_list_1.recordsVoSchema.pick({ records: true });
exports.CREATE_RECORD = '/table/{tableId}/record';
exports.CreateRecordRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_RECORD,
    summary: 'Create records',
    description: 'Create one or multiple records with support for field value typecast and custom record ordering.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.createRecordsRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns data about the records.',
            content: {
                'application/json': {
                    schema: exports.createRecordsVoSchema,
                },
            },
        },
    },
    tags: ['record'],
});
async function createRecords(tableId, recordsRo) {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_RECORD, { tableId }), recordsRo);
}
exports.createRecords = createRecords;
