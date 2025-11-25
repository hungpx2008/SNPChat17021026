"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paste = exports.PasteRoute = exports.pasteVoSchema = exports.pasteRoSchema = exports.PASTE_URL = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const range_1 = require("./range");
exports.PASTE_URL = '/table/{tableId}/selection/paste';
exports.pasteRoSchema = range_1.rangesRoSchema.extend({
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
exports.pasteVoSchema = zod_1.z.object({
    ranges: zod_1.z.tuple([range_1.cellSchema, range_1.cellSchema]),
});
exports.PasteRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.PASTE_URL,
    summary: 'Paste content into selected range',
    description: 'Apply paste operation to insert content into the selected table range',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pasteRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Paste successfully',
            content: {
                'application/json': {
                    schema: exports.pasteVoSchema,
                },
            },
        },
    },
    tags: ['selection'],
});
const paste = async (tableId, pasteRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.PASTE_URL, {
        tableId,
    }), pasteRo);
};
exports.paste = paste;
