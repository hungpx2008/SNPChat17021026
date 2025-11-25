"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movePluginContextMenu = exports.pluginContextMenuMoveRoute = exports.pluginContextMenuMoveRoSchema = exports.PLUGIN_CONTEXT_MENU_MOVE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PLUGIN_CONTEXT_MENU_MOVE = '/table/{tableId}/plugin-context-menu/{pluginInstallId}/move';
exports.pluginContextMenuMoveRoSchema = zod_1.z.object({
    anchorId: zod_1.z.string(),
    position: zod_1.z.enum(['before', 'after']),
});
exports.pluginContextMenuMoveRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.PLUGIN_CONTEXT_MENU_MOVE,
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            pluginInstallId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.pluginContextMenuMoveRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Plugin context menu moved successfully.',
        },
    },
    tags: ['plugin-context-menu'],
});
const movePluginContextMenu = async (tableId, pluginInstallId, ro) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.PLUGIN_CONTEXT_MENU_MOVE, { tableId, pluginInstallId }), ro);
};
exports.movePluginContextMenu = movePluginContextMenu;
