"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewGroup = exports.UpdateViewGroupRoute = exports.VIEW_GROUP = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_GROUP = '/table/{tableId}/view/{viewId}/group';
exports.UpdateViewGroupRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_GROUP,
    description: 'Update view group condition',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.groupSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successfully update.',
        },
    },
    tags: ['view'],
});
const updateViewGroup = async (tableId, viewId, groupViewRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_GROUP, {
        tableId,
        viewId,
    }), groupViewRo);
};
exports.updateViewGroup = updateViewGroup;
