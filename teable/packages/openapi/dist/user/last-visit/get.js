"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLastVisit = exports.GetUserLastVisitRoute = exports.getUserLastVisitRoSchema = exports.userLastVisitVoSchema = exports.LastVisitResourceType = exports.GET_USER_LAST_VISIT = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
exports.GET_USER_LAST_VISIT = '/user/last-visit';
var LastVisitResourceType;
(function (LastVisitResourceType) {
    LastVisitResourceType["Base"] = "base";
    LastVisitResourceType["Table"] = "table";
    LastVisitResourceType["View"] = "view";
    LastVisitResourceType["Dashboard"] = "dashboard";
    LastVisitResourceType["Automation"] = "automation";
})(LastVisitResourceType || (exports.LastVisitResourceType = LastVisitResourceType = {}));
exports.userLastVisitVoSchema = zod_1.z.object({
    resourceType: zod_1.z.nativeEnum(LastVisitResourceType),
    resourceId: zod_1.z.string(),
    childResourceId: zod_1.z.string().optional(),
});
exports.getUserLastVisitRoSchema = zod_1.z.object({
    resourceType: zod_1.z.nativeEnum(LastVisitResourceType),
    parentResourceId: zod_1.z.string(),
});
exports.GetUserLastVisitRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_USER_LAST_VISIT,
    description: 'Get user last visited resource',
    request: {
        query: exports.getUserLastVisitRoSchema,
    },
    responses: {
        200: {
            description: 'Returns data about user last visit.',
            content: {
                'application/json': {
                    schema: exports.userLastVisitVoSchema.optional(),
                },
            },
        },
    },
    tags: ['user'],
});
const getUserLastVisit = async (params) => {
    return axios_1.axios.get(exports.GET_USER_LAST_VISIT, { params });
};
exports.getUserLastVisit = getUserLastVisit;
