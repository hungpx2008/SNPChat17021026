"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUnpublishPlugin = exports.adminUnpublishPluginRouter = exports.ADMIN_PLUGIN_UNPUBLISH = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.ADMIN_PLUGIN_UNPUBLISH = '/admin/plugin/{pluginId}/unpublish';
exports.adminUnpublishPluginRouter = (0, utils_1.registerRoute)({
    method: 'patch',
    description: 'Admin unpublish a plugin',
    path: exports.ADMIN_PLUGIN_UNPUBLISH,
    request: {
        params: zod_1.z.object({
            pluginId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Plugin unpublished successfully.',
        },
    },
    tags: ['admin'],
});
const adminUnpublishPlugin = async (pluginId) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.ADMIN_PLUGIN_UNPUBLISH, { pluginId }));
};
exports.adminUnpublishPlugin = adminUnpublishPlugin;
