"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getView = exports.GetViewRoute = exports.GET_VIEW = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_VIEW = '/table/{tableId}/view/{viewId}';
exports.GetViewRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_VIEW,
    description: 'Get a view',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns data about a view.',
            content: {
                'application/json': {
                    schema: core_1.viewVoSchema,
                },
            },
        },
    },
    tags: ['view'],
});
const getView = async (tableId, viewId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_VIEW, {
        tableId,
        viewId,
    }));
};
exports.getView = getView;
