"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateList = exports.GetTemplateRoute = exports.templateVoSchema = exports.templateCoverVoSchema = exports.GET_TEMPLATE_LIST = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const update_1 = require("./update");
exports.GET_TEMPLATE_LIST = '/template';
exports.templateCoverVoSchema = update_1.templateCoverRoSchema.extend({
    presignedUrl: zod_1.z.string(),
});
exports.templateVoSchema = zod_1.z.object({
    id: zod_1.z.string().startsWith(core_1.IdPrefix.Template),
    name: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().startsWith(core_1.IdPrefix.TemplateCategory).optional(),
    isSystem: zod_1.z.boolean().optional(),
    isPublished: zod_1.z.boolean().optional(),
    snapshot: zod_1.z.object({
        baseId: zod_1.z.string().startsWith(core_1.IdPrefix.Base),
        snapshotTime: zod_1.z.string().datetime(),
        spaceId: zod_1.z.string().startsWith(core_1.IdPrefix.Space),
        name: zod_1.z.string(),
    }),
    description: zod_1.z.string().optional(),
    baseId: zod_1.z.string().startsWith(core_1.IdPrefix.Base).optional(),
    cover: exports.templateCoverVoSchema,
    usageCount: zod_1.z.number(),
    markdownDescription: zod_1.z.string().optional(),
});
exports.GetTemplateRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TEMPLATE_LIST,
    description: 'get template list',
    request: {},
    responses: {
        201: {
            description: 'Successfully get template list.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(exports.templateVoSchema),
                },
            },
        },
    },
    tags: ['template'],
});
const getTemplateList = async () => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_TEMPLATE_LIST));
};
exports.getTemplateList = getTemplateList;
