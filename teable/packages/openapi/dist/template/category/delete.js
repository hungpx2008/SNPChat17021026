"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplateCategory = exports.DeleteTemplateCategoryRoute = exports.DELETE_TEMPLATE_CATEGORY = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.DELETE_TEMPLATE_CATEGORY = '/template/category/{templateCategoryId}';
exports.DeleteTemplateCategoryRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_TEMPLATE_CATEGORY,
    description: 'delete a template category',
    request: {
        params: zod_1.z.object({
            templateCategoryId: zod_1.z.string().startsWith(core_1.IdPrefix.TemplateCategory),
        }),
    },
    responses: {
        201: {
            description: 'Successfully delete template category.',
        },
    },
    tags: ['template'],
});
const deleteTemplateCategory = async (templateCategoryId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_TEMPLATE_CATEGORY, { templateCategoryId }));
};
exports.deleteTemplateCategory = deleteTemplateCategory;
