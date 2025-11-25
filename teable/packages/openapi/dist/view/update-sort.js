"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewSort = exports.updateViewSortRoute = exports.viewSortRoSchema = exports.VIEW_SORT = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_SORT = '/table/{tableId}/view/{viewId}/sort';
exports.viewSortRoSchema = zod_1.z.object({
    sort: core_1.sortSchema,
});
exports.updateViewSortRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_SORT,
    description: 'Update view sort condition',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.sortSchema,
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
const updateViewSort = async (tableId, viewId, sortViewRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_SORT, {
        tableId,
        viewId,
    }), sortViewRo);
};
exports.updateViewSort = updateViewSort;
