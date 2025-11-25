"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadFileRoute = exports.READ_FILE_URL = void 0;
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.READ_FILE_URL = '/attachments/{token}';
exports.ReadFileRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.READ_FILE_URL,
    description: 'Upload attachment',
    request: {
        params: zod_1.z.object({
            token: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            filename: zod_1.z.string().optional().openapi({ description: 'File name for download' }),
        }),
    },
    responses: {
        200: {
            description: '',
        },
    },
    tags: ['attachments'],
});
