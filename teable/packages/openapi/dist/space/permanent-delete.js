"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permanentDeleteSpace = exports.PermanentDeleteSpaceRoute = exports.PERMANENT_DELETE_SPACE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.PERMANENT_DELETE_SPACE = '/space/{spaceId}/permanent';
exports.PermanentDeleteSpaceRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.PERMANENT_DELETE_SPACE,
    description: 'Permanently delete a space by spaceId',
    request: {
        params: zod_1.z.object({
            spaceId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Permanently deleted successfully',
        },
    },
    tags: ['space'],
});
const permanentDeleteSpace = async (spaceId) => {
    return await axios_1.axios.delete((0, utils_1.urlBuilder)(exports.PERMANENT_DELETE_SPACE, {
        spaceId,
    }));
};
exports.permanentDeleteSpace = permanentDeleteSpace;
