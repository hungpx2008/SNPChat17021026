"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTemplate = exports.UpdateTemplateRoute = exports.updateTemplateRoSchema = exports.templateCoverRoSchema = exports.UPDATE_TEMPLATE = void 0;
const core_1 = require("@teable/core");
const attachment_1 = require("../attachment");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UPDATE_TEMPLATE = '/template/{templateId}';
exports.templateCoverRoSchema = attachment_1.notifyVoSchema
    .pick({
    token: true,
    size: true,
    url: true,
    path: true,
    mimetype: true,
    width: true,
    height: true,
})
    .extend({
    name: zod_1.z.string(),
    id: zod_1.z.string().startsWith(core_1.IdPrefix.Attachment),
});
exports.updateTemplateRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    cover: exports.templateCoverRoSchema.optional().nullable(),
    isPublished: zod_1.z.boolean().optional(),
    isSystem: zod_1.z.boolean().optional(),
    baseId: zod_1.z.string().optional(),
    markdownDescription: zod_1.z.string().optional(),
});
exports.UpdateTemplateRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_TEMPLATE,
    description: 'update a template',
    request: {
        params: zod_1.z.object({
            templateId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateTemplateRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successfully update template.',
        },
    },
    tags: ['template'],
});
const updateTemplate = async (templateId, updateTemplateRoSchema) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_TEMPLATE, { templateId }), updateTemplateRoSchema);
};
exports.updateTemplate = updateTemplate;
