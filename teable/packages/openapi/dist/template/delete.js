"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.DeleteTemplateRoute = exports.DELETE_TEMPLATE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_TEMPLATE = '/template/{templateId}';
exports.DeleteTemplateRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_TEMPLATE,
    description: 'delete a template',
    request: {
        params: zod_1.z.object({
            templateId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Successfully delete template.',
        },
    },
    tags: ['template'],
});
const deleteTemplate = async (templateId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_TEMPLATE, { templateId }));
};
exports.deleteTemplate = deleteTemplate;
