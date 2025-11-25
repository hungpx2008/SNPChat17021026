"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlugin = exports.DeletePluginRoute = exports.deletePluginRoSchema = exports.DELETE_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_PLUGIN = '/plugin/{id}';
exports.deletePluginRoSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
exports.DeletePluginRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_PLUGIN,
    description: 'Delete a plugin',
    request: {
        params: exports.deletePluginRoSchema,
    },
    responses: {
        200: {
            description: 'Returns no content.',
        },
    },
    tags: ['plugin'],
});
const deletePlugin = async (id) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_PLUGIN, { id }));
};
exports.deletePlugin = deletePlugin;
