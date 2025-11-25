"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitPlugin = exports.pluginSubmitRouter = exports.PLUGIN_SUBMIT = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_SUBMIT = '/plugin/{pluginId}/submit';
exports.pluginSubmitRouter = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.PLUGIN_SUBMIT,
    description: 'Submit a plugin',
    request: {
        params: zod_1.z.object({
            pluginId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin submitted successfully.',
        },
    },
    tags: ['plugin'],
});
const submitPlugin = async (pluginId) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.PLUGIN_SUBMIT, { pluginId }));
};
exports.submitPlugin = submitPlugin;
