"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecord = exports.UpdateRecordRoute = exports.UPDATE_RECORD = exports.updateRecordsRoSchema = exports.updateRecordRoSchema = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
const get_1 = require("./get");
exports.updateRecordRoSchema = zod_1.z
    .object({
    fieldKeyType: get_1.fieldKeyTypeRoSchema,
    typecast: get_1.typecastSchema,
    record: zod_1.z.object({
        fields: core_1.recordSchema.shape.fields,
    }),
    order: create_1.recordInsertOrderRoSchema.optional(),
})
    .openapi({
    description: 'Update record by id',
});
exports.updateRecordsRoSchema = zod_1.z
    .object({
    fieldKeyType: get_1.fieldKeyTypeRoSchema,
    typecast: get_1.typecastSchema,
    records: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        fields: core_1.recordSchema.shape.fields,
    })),
    order: create_1.recordInsertOrderRoSchema.optional(),
})
    .openapi({
    description: 'Multiple Update records',
});
exports.UPDATE_RECORD = '/table/{tableId}/record/{recordId}';
exports.UpdateRecordRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_RECORD,
    summary: 'Update record',
    description: 'Update a single record by its ID with support for field value typecast and record reordering.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateRecordRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Returns record data after update.',
            content: {
                'application/json': {
                    schema: core_1.recordSchema,
                },
            },
        },
    },
    tags: ['record'],
});
async function updateRecord(tableId, recordId, recordRo) {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_RECORD, { tableId, recordId }), recordRo);
}
exports.updateRecord = updateRecord;
