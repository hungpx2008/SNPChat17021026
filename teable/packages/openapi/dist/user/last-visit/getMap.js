"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLastVisitMap = exports.GetUserLastVisitMapRoute = exports.userLastVisitMapVoSchema = exports.GET_USER_LAST_VISIT_MAP = void 0;
const axios_1 = require("../../axios");
const utils_1 = require("../../utils");
const zod_1 = require("../../zod");
const get_1 = require("./get");
exports.GET_USER_LAST_VISIT_MAP = '/user/last-visit/map';
exports.userLastVisitMapVoSchema = zod_1.z.record(zod_1.z.string(), get_1.userLastVisitVoSchema);
exports.GetUserLastVisitMapRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_USER_LAST_VISIT_MAP,
    description: 'Get user last visited resource map',
    request: {
        query: get_1.getUserLastVisitRoSchema,
    },
    responses: {
        200: {
            description: 'Returns data about user last visit map.',
            content: {
                'application/json': {
                    schema: exports.userLastVisitMapVoSchema,
                },
            },
        },
    },
    tags: ['user'],
});
const getUserLastVisitMap = async (params) => {
    return axios_1.axios.get(exports.GET_USER_LAST_VISIT_MAP, { params });
};
exports.getUserLastVisitMap = getUserLastVisitMap;
