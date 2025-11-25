"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteView = exports.DeleteViewRoute = exports.DELETE_VIEW = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_VIEW = '/table/{tableId}/view/{viewId}';
exports.DeleteViewRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_VIEW,
    description: 'Delete a view',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Deleted successfully',
        },
    },
    tags: ['view'],
});
const deleteView = async (tableId, viewId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_VIEW, {
        tableId,
        viewId,
    }));
};
exports.deleteView = deleteView;
