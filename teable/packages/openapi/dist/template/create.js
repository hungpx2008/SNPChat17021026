"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplate = exports.CreateTemplateRoute = exports.createTemplateRoSchema = exports.CREATE_TEMPLATE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CREATE_TEMPLATE = '/template/create';
exports.createTemplateRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
});
exports.CreateTemplateRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_TEMPLATE,
    description: 'create a template',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.createTemplateRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successfully create template.',
        },
    },
    tags: ['template'],
});
const createTemplate = async (createTemplateRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_TEMPLATE), createTemplateRo);
};
exports.createTemplate = createTemplate;
