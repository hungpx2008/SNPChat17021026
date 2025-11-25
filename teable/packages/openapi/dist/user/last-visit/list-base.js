"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLastVisitListBase = exports.GetUserLastVisitListBaseRoute = exports.userLastVisitListBaseVoSchema = exports.userLastVisitItemBaseVoSchema = exports.GET_USER_LAST_VISIT_LIST_BASE = void 0;
const axios_1 = require("../../axios");
const get_1 = require("../../base/get");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
const get_2 = require("./get");
exports.GET_USER_LAST_VISIT_LIST_BASE = '/user/last-visit/list-base';
exports.userLastVisitItemBaseVoSchema = zod_1.z.object({
    resourceType: zod_1.z.nativeEnum(get_2.LastVisitResourceType),
    resourceId: zod_1.z.string(),
    resource: get_1.getBaseItemSchema.omit({ collaboratorType: true }),
    lastVisitTime: zod_1.z.string().optional(),
});
exports.userLastVisitListBaseVoSchema = (0, types_1.getListSchemaVo)(exports.userLastVisitItemBaseVoSchema);
exports.GetUserLastVisitListBaseRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_USER_LAST_VISIT_LIST_BASE,
    responses: {
        200: {
            description: 'Returns data about user last visit base.',
            content: {
                'application/json': {
                    schema: exports.userLastVisitListBaseVoSchema,
                },
            },
        },
    },
    tags: ['user'],
});
const getUserLastVisitListBase = async () => {
    return axios_1.axios.get(exports.GET_USER_LAST_VISIT_LIST_BASE);
};
exports.getUserLastVisitListBase = getUserLastVisitListBase;
