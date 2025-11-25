"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBase = exports.DeleteBaseRoute = exports.DELETE_BASE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_BASE = '/base/{baseId}';
exports.DeleteBaseRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_BASE,
    description: 'Delete a base by baseId',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Deleted successfully',
        },
    },
    tags: ['base'],
});
const deleteBase = async (baseId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_BASE, {
        baseId,
    }));
};
exports.deleteBase = deleteBase;
