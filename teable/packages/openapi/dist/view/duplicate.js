"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateView = exports.DuplicateViewRoute = exports.DUPLICATE_VIEW = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DUPLICATE_VIEW = '/table/{tableId}/view/{viewId}/duplicate';
exports.DuplicateViewRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.DUPLICATE_VIEW,
    description: 'Duplicate a view',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
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
const duplicateView = async (tableId, viewId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.DUPLICATE_VIEW, { tableId, viewId }));
};
exports.duplicateView = duplicateView;
