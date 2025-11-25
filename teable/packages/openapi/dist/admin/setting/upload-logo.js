"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLogo = exports.UploadLogoRoute = exports.uploadLogoVoSchema = exports.uploadLogoRoSchema = exports.UPLOAD_LOGO = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.UPLOAD_LOGO = '/admin/setting/logo';
exports.uploadLogoRoSchema = zod_1.z.object({
    file: zod_1.z.string().openapi({ format: 'binary' }),
});
exports.uploadLogoVoSchema = zod_1.z.object({
    url: zod_1.z.string(),
});
exports.UploadLogoRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPLOAD_LOGO,
    description: 'Upload logo',
    request: {
        body: {
            content: {
                'multipart/form-data': {
                    schema: exports.uploadLogoRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successfully upload logo.',
            content: {
                'application/json': {
                    schema: exports.uploadLogoVoSchema,
                },
            },
        },
    },
    tags: ['admin'],
});
const uploadLogo = async (uploadLogoRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPLOAD_LOGO), uploadLogoRo);
};
exports.uploadLogo = uploadLogo;
