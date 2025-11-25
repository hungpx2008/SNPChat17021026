"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignature = exports.SignatureRoute = exports.SIGNATURE_URL = exports.signatureVoSchema = exports.signatureRoSchema = exports.UploadType = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
var UploadType;
(function (UploadType) {
    UploadType[UploadType["Table"] = 1] = "Table";
    UploadType[UploadType["Avatar"] = 2] = "Avatar";
    UploadType[UploadType["Form"] = 3] = "Form";
    UploadType[UploadType["OAuth"] = 4] = "OAuth";
    UploadType[UploadType["Import"] = 5] = "Import";
    UploadType[UploadType["Plugin"] = 6] = "Plugin";
    UploadType[UploadType["Comment"] = 7] = "Comment";
    UploadType[UploadType["Logo"] = 8] = "Logo";
    UploadType[UploadType["ExportBase"] = 9] = "ExportBase";
    UploadType[UploadType["Template"] = 10] = "Template";
    UploadType[UploadType["ChatDataVisualizationCode"] = 11] = "ChatDataVisualizationCode";
    UploadType[UploadType["App"] = 12] = "App";
    UploadType[UploadType["ChatFile"] = 13] = "ChatFile";
    UploadType[UploadType["Automation"] = 14] = "Automation";
})(UploadType || (exports.UploadType = UploadType = {}));
exports.signatureRoSchema = zod_1.z.object({
    contentType: zod_1.z.string().openapi({ example: 'image/png', description: 'Mime type' }),
    contentLength: zod_1.z.number().openapi({ example: 123, description: 'File size' }),
    expiresIn: zod_1.z
        .number()
        .optional()
        .openapi({ example: 60 * 60 * 1, description: 'Token expire time, seconds' }),
    hash: zod_1.z.string().optional().openapi({ example: 'xxxxxxxx', description: 'File hash' }),
    type: zod_1.z.nativeEnum(UploadType).openapi({ example: UploadType.Table, description: 'Type' }),
    baseId: zod_1.z.string().optional(),
});
exports.signatureVoSchema = zod_1.z.object({
    url: zod_1.z.string().openapi({
        example: 'https://example.com/attachment/upload',
        description: 'Upload url',
    }),
    uploadMethod: zod_1.z.string().openapi({ example: 'POST', description: 'Upload method' }),
    token: zod_1.z.string().openapi({ example: 'xxxxxxxx', description: 'Secret key' }),
    requestHeaders: zod_1.z.record(zod_1.z.unknown()).openapi({ example: { 'Content-Type': 'image/png' } }),
});
exports.SIGNATURE_URL = '/attachments/signature';
exports.SignatureRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SIGNATURE_URL,
    description: 'Retrieve upload signature.',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.signatureRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'return the upload URL and the key.',
            content: {
                'application/json': {
                    schema: exports.signatureVoSchema,
                },
            },
        },
    },
    tags: ['attachments'],
});
const getSignature = async (params, shareId) => {
    return axios_1.axios.post(exports.SIGNATURE_URL, params, {
        headers: {
            'Tea-Share-Id': shareId,
        },
    });
};
exports.getSignature = getSignature;
