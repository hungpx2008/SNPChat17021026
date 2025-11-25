"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planFieldCreate = exports.planFieldCreateRoute = exports.PLAN_FIELD_CREATE = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const plan_1 = require("./plan");
exports.PLAN_FIELD_CREATE = '/table/{tableId}/field/plan';
exports.planFieldCreateRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.PLAN_FIELD_CREATE,
    description: 'Generate calculation plan for creating the field',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: core_1.createFieldRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Returns the calculation plan for creating the field',
            content: {
                'application/json': {
                    schema: plan_1.planFieldVoSchema,
                },
            },
        },
    },
    tags: ['plan'],
});
const planFieldCreate = async (tableId, fieldRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.PLAN_FIELD_CREATE, { tableId }), fieldRo);
};
exports.planFieldCreate = planFieldCreate;
