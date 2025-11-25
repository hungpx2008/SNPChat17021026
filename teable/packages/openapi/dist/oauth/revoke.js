"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeAccess = exports.revokeAccessRoute = exports.REVOKE_ACCESS = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.REVOKE_ACCESS = '/oauth/client/{clientId}/revoke-access';
exports.revokeAccessRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.REVOKE_ACCESS,
    request: {
        params: zod_1.z.object({
            clientId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Revoke access permission successfully',
        },
    },
    tags: ['oauth'],
});
const revokeAccess = async (clientId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.REVOKE_ACCESS, { clientId }));
};
exports.revokeAccess = revokeAccess;
