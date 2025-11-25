"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewList = exports.GetViewListRoute = exports.GET_VIEW_LIST = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_VIEW_LIST = '/table/{tableId}/view';
exports.GetViewListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_VIEW_LIST,
    summary: 'Get view list',
    description: 'Get view list',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the list of view.',
            content: {
                'application/json': {
                    schema: zod_1.z.array(core_1.viewVoSchema),
                },
            },
        },
    },
    tags: ['view'],
});
const getViewList = async (tableId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.GET_VIEW_LIST, { tableId }));
};
exports.getViewList = getViewList;
