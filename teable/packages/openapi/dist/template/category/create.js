"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplateCategory = exports.CreateTemplateCategoryRoute = exports.createTemplateCategoryRoSchema = exports.CREATE_TEMPLATE_CATEGORY = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.CREATE_TEMPLATE_CATEGORY = '/template/category/create';
exports.createTemplateCategoryRoSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.CreateTemplateCategoryRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_TEMPLATE_CATEGORY,
    description: 'create a template category',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.createTemplateCategoryRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successfully create template category.',
        },
    },
    tags: ['template'],
});
const createTemplateCategory = async (createTemplateCategoryRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_TEMPLATE_CATEGORY), createTemplateCategoryRo);
};
exports.createTemplateCategory = createTemplateCategory;
