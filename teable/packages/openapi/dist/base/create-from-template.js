"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseFromTemplate = exports.CreateBaseFromTemplateRoute = exports.createBaseFromTemplateRoSchema = exports.CREATE_BASE_FROM_TEMPLATE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.CREATE_BASE_FROM_TEMPLATE = '/base/create-from-template';
exports.createBaseFromTemplateRoSchema = zod_1.z.object({
    spaceId: zod_1.z.string().describe('The space id to create a base from'),
    templateId: zod_1.z.string().describe('The template id to create a base from'),
    withRecords: zod_1.z.boolean().optional().describe('Whether to create records from the template'),
    baseId: zod_1.z.string().optional().describe('The base id to apply the template to'),
});
exports.CreateBaseFromTemplateRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_BASE_FROM_TEMPLATE,
    summary: 'Create a base from template or apply a template to a base',
    description: 'Create a base from template or apply a template to a base',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.createBaseFromTemplateRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns information about a successfully created base.',
            content: {
                'application/json': {
                    schema: create_1.createBaseVoSchema,
                },
            },
        },
    },
    tags: ['base'],
});
const createBaseFromTemplate = async (createBaseRo) => {
    return axios_1.axios.post(exports.CREATE_BASE_FROM_TEMPLATE, createBaseRo);
};
exports.createBaseFromTemplate = createBaseFromTemplate;
