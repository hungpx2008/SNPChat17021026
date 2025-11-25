"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishPlugin = exports.adminPluginPublishRoute = exports.ADMIN_PLUGIN_PUBLISH = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.ADMIN_PLUGIN_PUBLISH = '/admin/plugin/{pluginId}/publish';
exports.adminPluginPublishRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.ADMIN_PLUGIN_PUBLISH,
    description: 'Publish a plugin',
    request: {
        params: zod_1.z.object({
            pluginId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin published successfully.',
        },
    },
    tags: ['admin'],
});
const publishPlugin = async (pluginId) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.ADMIN_PLUGIN_PUBLISH, { pluginId }));
};
exports.publishPlugin = publishPlugin;
