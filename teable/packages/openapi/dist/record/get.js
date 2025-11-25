"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecord = exports.GetRecordRoute = exports.GET_RECORD_URL = exports.getRecordQuerySchema = exports.typecastSchema = exports.fieldKeyTypeRoSchema = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.fieldKeyTypeRoSchema = zod_1.z
    .nativeEnum(core_1.FieldKeyType, {
    errorMap: () => ({
        message: 'Error fieldKeyType, You should set it to "name" or "id" or "dbFieldName"',
    }),
})
    .default(core_1.FieldKeyType.Name) // is not work with optional()...
    .transform((v) => v ?? core_1.FieldKeyType.Name)
    .optional()
    .openapi({
    description: 'Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details',
})
    .describe('Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details');
exports.typecastSchema = zod_1.z
    .boolean()
    .optional()
    .openapi({
    description: 'Automatic data conversion from cellValues if the typecast parameter is passed in. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources.',
})
    .describe('Automatic data conversion from cellValues if the typecast parameter is passed in. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources.');
exports.getRecordQuerySchema = zod_1.z.object({
    projection: zod_1.z
        .union([zod_1.z.string(), zod_1.z.string().array()])
        .transform((val) => (typeof val === 'string' ? [val] : val))
        .optional()
        .openapi({
        type: 'array',
        items: { type: 'string' },
        description: 'If you want to get only some fields, pass in this parameter, otherwise all visible fields will be obtained, The parameter value depends on the specified fieldKeyType to determine whether it is name or id',
    }),
    cellFormat: zod_1.z
        .nativeEnum(core_1.CellFormat, {
        errorMap: () => ({ message: 'Error cellFormat, You should set it to "json" or "text"' }),
    })
        .default(core_1.CellFormat.Json)
        .optional()
        .openapi({
        description: 'Define the return value formate, you can set it to text if you only need simple string value',
    }),
    fieldKeyType: exports.fieldKeyTypeRoSchema,
});
exports.GET_RECORD_URL = '/table/{tableId}/record/{recordId}';
exports.GetRecordRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_RECORD_URL,
    summary: 'Get record',
    description: 'Retrieve a single record by its ID with options to specify field projections and output format.',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
        }),
        query: exports.getRecordQuerySchema,
    },
    responses: {
        200: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: core_1.recordSchema,
                },
            },
        },
    },
    tags: ['record'],
});
async function getRecord(tableId, recordId, query) {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_RECORD_URL, { tableId, recordId }), { params: query });
}
exports.getRecord = getRecord;
