"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installViewPlugin = exports.ViewInstallPluginRoute = exports.viewInstallPluginVoSchema = exports.viewInstallPluginRoSchema = exports.VIEW_INSTALL_PLUGIN = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_INSTALL_PLUGIN = '/table/{tableId}/view/plugin';
exports.viewInstallPluginRoSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    pluginId: zod_1.z.string(),
});
exports.viewInstallPluginVoSchema = zod_1.z.object({
    pluginId: zod_1.z.string(),
    pluginInstallId: zod_1.z.string(),
    name: zod_1.z.string(),
    viewId: zod_1.z.string(),
});
exports.ViewInstallPluginRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.VIEW_INSTALL_PLUGIN,
    description: 'Install a plugin to a view',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.viewInstallPluginRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns data about the installed plugin.',
            content: {
                'application/json': {
                    schema: exports.viewInstallPluginVoSchema,
                },
            },
        },
    },
    tags: ['view'],
});
const installViewPlugin = async (tableId, ro) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.VIEW_INSTALL_PLUGIN, { tableId }), ro);
};
exports.installViewPlugin = installViewPlugin;
