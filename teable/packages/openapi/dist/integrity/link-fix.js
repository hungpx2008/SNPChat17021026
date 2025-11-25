"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixBaseIntegrity = exports.IntegrityFixRoute = exports.FIX_BASE_INTEGRITY = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const link_check_1 = require("./link-check");
exports.FIX_BASE_INTEGRITY = '/integrity/base/{baseId}/link-fix?tableId={tableId}';
exports.IntegrityFixRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.FIX_BASE_INTEGRITY,
    description: 'Fix integrity of link fields in a base',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
    },
    responses: {
        201: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: zod_1.z.array(link_check_1.integrityIssueSchema),
                },
            },
        },
    },
    tags: ['integrity'],
});
const fixBaseIntegrity = async (baseId, tableId) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.FIX_BASE_INTEGRITY, {
        baseId,
        tableId,
    }));
};
exports.fixBaseIntegrity = fixBaseIntegrity;
