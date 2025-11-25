"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateDetail = exports.GetTemplateDetailRoute = exports.GET_TEMPLATE_DETAIL = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const get_1 = require("./get");
exports.GET_TEMPLATE_DETAIL = '/template/{templateId}';
exports.GetTemplateDetailRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TEMPLATE_DETAIL,
    description: 'get template detail by templateId',
    summary: 'get template detail by templateId',
    request: {},
    responses: {
        201: {
            description: 'Successfully get template detail.',
            content: {
                'application/json': {
                    schema: get_1.templateVoSchema,
                },
            },
        },
    },
    tags: ['template'],
});
const getTemplateDetail = async (templateId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_TEMPLATE_DETAIL, { templateId }));
};
exports.getTemplateDetail = getTemplateDetail;
