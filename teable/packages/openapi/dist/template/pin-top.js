"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinTopTemplate = exports.PinTopTemplateRoute = exports.PIN_TOP_TEMPLATE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PIN_TOP_TEMPLATE = '/template/{templateId}/pin-top';
exports.PinTopTemplateRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.PIN_TOP_TEMPLATE,
    description: 'pin top a template',
    request: {
        params: zod_1.z.object({
            templateId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Successfully pin top a template.',
        },
    },
    tags: ['template'],
});
const pinTopTemplate = async (templateId) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.PIN_TOP_TEMPLATE, { templateId }));
};
exports.pinTopTemplate = pinTopTemplate;
