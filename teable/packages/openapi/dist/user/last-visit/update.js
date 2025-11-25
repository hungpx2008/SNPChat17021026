"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserLastVisit = exports.UpdateUserLastVisitRoute = exports.updateUserLastVisitRoSchema = exports.UPDATE_USER_LAST_VISIT = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
const get_1 = require("./get");
exports.UPDATE_USER_LAST_VISIT = '/user/last-visit';
exports.updateUserLastVisitRoSchema = zod_1.z.object({
    resourceType: zod_1.z.nativeEnum(get_1.LastVisitResourceType),
    resourceId: zod_1.z.string(),
    parentResourceId: zod_1.z.string(),
    childResourceId: zod_1.z.string().optional(),
});
exports.UpdateUserLastVisitRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.UPDATE_USER_LAST_VISIT,
    description: 'Update or create user last visit record',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.updateUserLastVisitRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Successfully updated user last visit record.',
        },
    },
    tags: ['user'],
});
const updateUserLastVisit = async (updateUserLastVisitRo) => {
    return axios_1.axios.post(exports.UPDATE_USER_LAST_VISIT, updateUserLastVisitRo);
};
exports.updateUserLastVisit = updateUserLastVisit;
