"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planFieldDelete = exports.planFieldDeleteRoute = exports.planFieldDeleteVoSchema = exports.PLAN_FIELD_DELETE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const plan_1 = require("./plan");
exports.PLAN_FIELD_DELETE = '/table/{tableId}/field/{fieldId}/plan';
exports.planFieldDeleteVoSchema = plan_1.planFieldVoSchema.partial();
exports.planFieldDeleteRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.PLAN_FIELD_DELETE,
    description: 'Generate calculation plan for deleting the field',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
            fieldId: zod_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: 'Returns the calculation plan for deleting the field',
            content: {
                'application/json': {
                    schema: exports.planFieldDeleteVoSchema,
                },
            },
        },
    },
    tags: ['plan'],
});
const planFieldDelete = async (tableId, fieldId) => {
    return axios_1.axios.delete((0, utils_1.urlBuilder)(exports.PLAN_FIELD_DELETE, { tableId, fieldId }));
};
exports.planFieldDelete = planFieldDelete;
