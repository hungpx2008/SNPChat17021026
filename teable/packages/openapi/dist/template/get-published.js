"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishedTemplateList = exports.GetPublishedTemplateListRoute = exports.GET_PUBLISHED_TEMPLATE_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
exports.GET_PUBLISHED_TEMPLATE_LIST = '/template/published';
exports.GetPublishedTemplateListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_PUBLISHED_TEMPLATE_LIST,
    description: 'get published template list',
    request: {},
    responses: {
        201: {
            description: 'Successfully get published template list.',
        },
    },
    tags: ['template'],
});
const getPublishedTemplateList = async () => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_PUBLISHED_TEMPLATE_LIST));
};
exports.getPublishedTemplateList = getPublishedTemplateList;
