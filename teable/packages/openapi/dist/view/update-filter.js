"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewFilter = exports.UpdateViewFilterRoute = exports.VIEW_FILTER = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_FILTER = '/table/{tableId}/view/{viewId}/filter';
exports.UpdateViewFilterRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_FILTER,
    description: 'Update view filter',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                // TODO zod-to-openapi does not support z.lazy which use in filterSchema
                'application/json': {
                    schema: core_1.filterRoSchema.openapi({
                        type: 'object',
                        example: {
                            filter: {
                                filterSet: [
                                    {
                                        isSymbol: false,
                                        fieldId: 'fldxxxxxxxxxxxxxxxx',
                                        value: 'value',
                                        operator: 'is',
                                    },
                                ],
                                conjunction: 'and',
                            },
                        },
                    }),
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
const updateViewFilter = async (tableId, viewId, filterRo) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_FILTER, {
        tableId,
        viewId,
    }), filterRo);
};
exports.updateViewFilter = updateViewFilter;
