"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = exports.NotifyRoute = exports.notifyVoSchema = exports.NOTIFY_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.NOTIFY_URL = '/attachments/notify/{token}';
exports.notifyVoSchema = zod_1.z.object({
    token: zod_1.z.string().openapi({ example: 'xxxxxxxxxxx', description: 'Token for the uploaded file' }),
    size: zod_1.z.number().openapi({ example: 1024, description: 'File size in bytes' }),
    url: zod_1.z.string().openapi({ example: '/bucket/xxxxx', description: 'URL of the uploaded file' }),
    path: zod_1.z.string().openapi({ example: '/table/xxxxxx', description: 'file path' }),
    mimetype: zod_1.z
        .string()
        .openapi({ example: 'video/mp4', description: 'MIME type of the uploaded file' }),
    width: zod_1.z
        .number()
        .optional()
        .openapi({ example: 100, description: 'Image width of the uploaded file' }),
    height: zod_1.z
        .number()
        .optional()
        .openapi({ example: 100, description: 'Image height of the uploaded file' }),
    presignedUrl: zod_1.z.string().openapi({ description: 'Preview url' }),
});
exports.NotifyRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.NOTIFY_URL,
    description: 'Get Attachment information',
    request: {
        params: zod_1.z.object({
            token: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            filename: zod_1.z.string().optional(),
        }),
    },
    responses: {
        201: {
            description: 'Attachment information',
            content: {
                'application/json': {
                    schema: exports.notifyVoSchema,
                },
            },
        },
    },
    tags: ['attachments'],
});
const notify = async (token, shareId, filename) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.NOTIFY_URL, { token }), undefined, {
        headers: {
            'Tea-Share-Id': shareId,
        },
        params: { filename },
    });
};
exports.notify = notify;
