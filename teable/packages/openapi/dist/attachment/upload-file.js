"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.UploadFileRoute = exports.UPLOAD_FILE_URL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPLOAD_FILE_URL = '/attachments/upload/{token}';
exports.UploadFileRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.UPLOAD_FILE_URL,
    description: 'Upload attachment',
    request: {
        params: zod_1.z.object({
            token: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: zod_1.z.string().openapi({ format: 'binary' }),
                },
            },
            description: 'upload attachment',
            required: true,
        },
    },
    responses: {
        201: {
            description: 'Upload successful',
        },
    },
    tags: ['attachments'],
});
const uploadFile = async (token, data, header, shareId) => {
    return axios_1.axios.put(`/attachments/upload/${token}`, data, {
        headers: {
            ...header,
            'Tea-Share-Id': shareId,
        },
    });
};
exports.uploadFile = uploadFile;
