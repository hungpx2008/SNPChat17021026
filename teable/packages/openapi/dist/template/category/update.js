"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTemplateCategory = exports.UpdateTemplateCategoryRoute = exports.updateTemplateCategoryRoSchema = exports.UPDATE_TEMPLATE_CATEGORY = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.UPDATE_TEMPLATE_CATEGORY = '/template/category/{templateCategoryId}';
exports.updateTemplateCategoryRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.UpdateTemplateCategoryRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UPDATE_TEMPLATE_CATEGORY,
    description: 'update a template category name',
    request: {
        params: zod_1.z.object({
            templateCategoryId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.updateTemplateCategoryRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successfully update template category name.',
        },
    },
    tags: ['template'],
});
const updateTemplateCategory = async (templateCategoryId, updateTemplateCategoryRoSchema) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UPDATE_TEMPLATE_CATEGORY, { templateCategoryId }), updateTemplateCategoryRoSchema);
};
exports.updateTemplateCategory = updateTemplateCategory;
