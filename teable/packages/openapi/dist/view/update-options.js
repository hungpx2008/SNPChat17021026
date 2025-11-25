"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewOptions = exports.UpdateViewOptionsRoute = exports.viewOptionsRoSchema = exports.VIEW_OPTION = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_OPTION = '/table/{tableId}/view/{viewId}/options';
exports.viewOptionsRoSchema = zod_1.z.object({
    options: core_1.viewOptionsSchema,
});
exports.UpdateViewOptionsRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.VIEW_OPTION,
    description: 'Update view option',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.viewOptionsRoSchema,
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
const updateViewOptions = async (tableId, viewId, viewOptionsRo) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.VIEW_OPTION, {
        tableId,
        viewId,
    }), viewOptionsRo);
};
exports.updateViewOptions = updateViewOptions;
