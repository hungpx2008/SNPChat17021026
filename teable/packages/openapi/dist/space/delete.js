"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpace = exports.DeleteSpaceRoute = exports.DELETE_SPACE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_SPACE = '/space/{spaceId}';
exports.DeleteSpaceRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_SPACE,
    description: 'Delete a space by spaceId',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Deleted successfully',
        },
    },
    tags: ['space'],
});
const deleteSpace = async (spaceId) => {
    return await axios_1.axios.delete((0, utils_1.urlBuilder)(exports.DELETE_SPACE, {
        spaceId,
    }));
};
exports.deleteSpace = deleteSpace;
