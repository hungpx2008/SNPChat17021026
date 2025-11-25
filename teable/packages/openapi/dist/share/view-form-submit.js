"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareViewFormSubmit = exports.ShareViewFormSubmitRouter = exports.shareViewFormSubmitRoSchema = exports.SHARE_VIEW_FORM_SUBMIT = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.SHARE_VIEW_FORM_SUBMIT = '/share/{shareId}/view/form-submit';
exports.shareViewFormSubmitRoSchema = zod_1.z.object({
    fields: core_1.recordSchema.shape.fields,
    typecast: zod_1.z.boolean().optional(),
});
exports.ShareViewFormSubmitRouter = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.SHARE_VIEW_FORM_SUBMIT,
    description: 'share form view submit new record',
    request: {
        params: zod_1.z.object({
            shareId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.shareViewFormSubmitRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successfully submit',
            content: {
                'application/json': {
                    schema: core_1.recordSchema,
                },
            },
        },
    },
    tags: ['share'],
});
const shareViewFormSubmit = (params) => {
    const { shareId, fields, typecast } = params;
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.SHARE_VIEW_FORM_SUBMIT, { shareId }), {
        fields,
        typecast,
    });
};
exports.shareViewFormSubmit = shareViewFormSubmit;
