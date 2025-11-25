"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createView = exports.CreateViewRoute = exports.CREATE_VIEW = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.CREATE_VIEW = '/table/{tableId}/view';
exports.CreateViewRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.CREATE_VIEW,
    description: 'Create a view',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.viewRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
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
const createView = async (tableId, viewRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.CREATE_VIEW, { tableId }), viewRo);
};
exports.createView = createView;
