"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateViewDescription = exports.updateViewDescriptionRoute = exports.viewDescriptionRoSchema = exports.VIEW_DESCRIPTION = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.VIEW_DESCRIPTION = '/table/{tableId}/view/{viewId}/description';
exports.viewDescriptionRoSchema = zod_1.z.object({
    description: zod_1.z.string(),
});
exports.updateViewDescriptionRoute = (0, utils_1.registerRoute)({
    method: 'put',
    path: exports.VIEW_DESCRIPTION,
    description: 'Update view description',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            viewId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.viewDescriptionRoSchema,
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
const updateViewDescription = async (tableId, viewId, data) => {
    return axios_1.axios.put((0, utils_1.urlBuilder)(exports.VIEW_DESCRIPTION, {
        tableId,
        viewId,
    }), data);
};
exports.updateViewDescription = updateViewDescription;
