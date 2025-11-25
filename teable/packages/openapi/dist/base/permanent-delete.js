"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permanentDeleteBase = exports.PermanentDeleteBaseRoute = exports.PERMANENT_DELETE_BASE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PERMANENT_DELETE_BASE = '/base/{baseId}/permanent';
exports.PermanentDeleteBaseRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.PERMANENT_DELETE_BASE,
    description: 'Permanently delete a base by baseId',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Permanently deleted successfully',
        },
    },
    tags: ['base'],
});
const permanentDeleteBase = async (baseId) => {
    return await axios_1.axios.delete((0, utils_1.urlBuilder)(exports.PERMANENT_DELETE_BASE, {
        baseId,
    }));
};
exports.permanentDeleteBase = permanentDeleteBase;
