"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manualSortView = exports.ManualSortViewRoute = exports.VIEW_MANUAL_SORT = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_MANUAL_SORT = '/table/{tableId}/view/{viewId}/manual-sort';
exports.ManualSortViewRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_MANUAL_SORT,
    description: 'Update view raw order',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.manualSortRoSchema,
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
const manualSortView = async (tableId, viewId, sortRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_MANUAL_SORT, {
        tableId,
        viewId,
    }), sortRo);
};
exports.manualSortView = manualSortView;
