"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAttachment = exports.UploadAttachmentRoute = exports.UPLOAD_ATTACHMENT_URL = void 0;
const core_1 = require("@teable/core");
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPLOAD_ATTACHMENT_URL = '/table/{tableId}/record/{recordId}/{fieldId}/uploadAttachment';
exports.UploadAttachmentRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.UPLOAD_ATTACHMENT_URL,
    summary: 'Upload attachment',
    description: 'Upload an attachment from a file or URL and append it to the cell',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            recordId: zod_1.z.string(),
            fieldId: zod_1.z.string().openapi({ description: 'ID of an attachment field' }),
        }),
        body: {
            content: {
                'multipart/form-data': {
                    schema: zod_1.z.object({
                        file: zod_1.z.any().optional().openapi({ type: 'string', format: 'binary' }),
                        fileUrl: zod_1.z.string().optional(),
                    }),
                },
            },
            description: 'upload attachment',
            required: true,
        },
    },
    responses: {
        201: {
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
const uploadAttachment = async (tableId, recordId, fieldId, file, options) => {
    const formData = new form_data_1.default();
    if (typeof file === 'string') {
        formData.append('fileUrl', file);
    }
    else if (file) {
        formData.append('file', file, options);
    }
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.UPLOAD_ATTACHMENT_URL, { tableId, recordId, fieldId }), formData, {
        headers: {
            ...formData.getHeaders(),
        },
    });
};
exports.uploadAttachment = uploadAttachment;
