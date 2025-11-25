"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishedTemplateCategoryList = exports.GetPublishedTemplateCategoryListRoute = exports.GET_PUBLISHED_TEMPLATE_CATEGORY_LIST = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
exports.GET_PUBLISHED_TEMPLATE_CATEGORY_LIST = '/template/category/list/published';
exports.GetPublishedTemplateCategoryListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_PUBLISHED_TEMPLATE_CATEGORY_LIST,
    description: 'get published template category list',
    summary: 'get published template category list',
    request: {},
    responses: {
        200: {
            description: 'Successfully get template category list.',
        },
    },
    tags: ['template'],
});
const getPublishedTemplateCategoryList = async () => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_PUBLISHED_TEMPLATE_CATEGORY_LIST));
};
exports.getPublishedTemplateCategoryList = getPublishedTemplateCategoryList;
