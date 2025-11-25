"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.temporaryPaste = exports.temporaryPasteRoute = exports.temporaryPasteVoSchema = exports.temporaryPasteRoSchema = exports.TEMPORARY_PASTE_URL = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const range_1 = require("./range");
exports.TEMPORARY_PASTE_URL = '/table/{tableId}/selection/temporaryPaste';
exports.temporaryPasteRoSchema = range_1.rangesRoSchema
    .pick({
    viewId: true,
    ranges: true,
    projection: true,
    ignoreViewQuery: true,
})
    .extend({
    content: zod_1.z
        .string()
        .or(zod_1.z.array(zod_1.z.array(zod_1.z.unknown())))
        .openapi({
        description: 'Content to paste',
        example: 'John\tDoe\tjohn.doe@example.com',
    }),
    header: zod_1.z.array(core_1.fieldVoSchema).optional().openapi({
        description: 'Table header for paste operation',
        example: [],
    }),
});
exports.temporaryPasteVoSchema = zod_1.z.array(core_1.recordSchema.pick({
    fields: true,
}));
exports.temporaryPasteRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.TEMPORARY_PASTE_URL,
    summary: 'Preview paste operation results',
    description: 'Preview the results of a paste operation without applying changes to the table',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.temporaryPasteRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Paste successfully',
            content: {
                'application/json': {
                    schema: exports.temporaryPasteVoSchema,
                },
            },
        },
    },
    tags: ['selection'],
});
const temporaryPaste = async (tableId, pasteRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.TEMPORARY_PASTE_URL, {
        tableId,
    }), pasteRo);
};
exports.temporaryPaste = temporaryPaste;
