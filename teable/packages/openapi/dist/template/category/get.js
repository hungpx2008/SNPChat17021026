"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateCategoryList = exports.GetTemplateCategoryListRoute = exports.templateCategoryListVoSchema = exports.GET_TEMPLATE_CATEGORY_LIST = void 0;
const core_1 = require("@teable/core");
const zod_1 = require("zod");
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
exports.GET_TEMPLATE_CATEGORY_LIST = '/template/category/list';
exports.templateCategoryListVoSchema = zod_1.z.object({
    id: zod_1.z.string().startsWith(core_1.IdPrefix.TemplateCategory),
    name: zod_1.z.string(),
    order: zod_1.z.number(),
});
exports.GetTemplateCategoryListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TEMPLATE_CATEGORY_LIST,
    description: 'get template category list',
    request: {},
    responses: {
        200: {
            description: 'Successfully get template category list.',
        },
    },
    tags: ['template'],
});
const getTemplateCategoryList = async () => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_TEMPLATE_CATEGORY_LIST));
};
exports.getTemplateCategoryList = getTemplateCategoryList;
