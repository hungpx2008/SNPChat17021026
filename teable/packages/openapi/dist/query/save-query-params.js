"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveQueryParams = exports.SAVE_QUERY_PARAMS_URL = exports.queryParamsVoSchema = exports.queryParamsRoSchema = void 0;
const zod_1 = require("zod");
const axios_1 = require("../axios");
exports.queryParamsRoSchema = zod_1.z.object({
    params: zod_1.z.record(zod_1.z.unknown()),
});
exports.queryParamsVoSchema = zod_1.z.object({
    queryId: zod_1.z.string().openapi({
        example: 'qry_xxxxxxxx',
        description: 'Unique ID for the saved query parameters',
    }),
});
exports.SAVE_QUERY_PARAMS_URL = '/query-params';
async function saveQueryParams(queryParamsRo) {
    return axios_1.axios.post(exports.SAVE_QUERY_PARAMS_URL, queryParamsRo);
}
exports.saveQueryParams = saveQueryParams;
