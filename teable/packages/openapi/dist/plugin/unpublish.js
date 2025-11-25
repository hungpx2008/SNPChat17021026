"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpublishPlugin = exports.unpublishPluginRouter = exports.UNPUBLISH_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.UNPUBLISH_PLUGIN = '/plugin/{pluginId}/unpublish';
exports.unpublishPluginRouter = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.UNPUBLISH_PLUGIN,
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
    tags: ['plugin'],
});
const unpublishPlugin = async (pluginId) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.UNPUBLISH_PLUGIN, { pluginId }));
};
exports.unpublishPlugin = unpublishPlugin;
