"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCsvFromTable = exports.ExportCsvFromTableRoute = exports.EXPORT_CSV_FROM_TABLE = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.EXPORT_CSV_FROM_TABLE = '/export/{tableId}';
exports.ExportCsvFromTableRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.EXPORT_CSV_FROM_TABLE,
    description: 'export csv from table',
    request: {
        params: zod_1.z.object({
            tableId: zod_1.z.string(),
        }),
        query: zod_1.z.object({
            viewId: zod_1.z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: 'Download successful',
        },
    },
    tags: ['export'],
});
const exportCsvFromTable = async (tableId, viewId) => {
    return axios_1.axios.get((0, utils_1.urlBuilder)(exports.EXPORT_CSV_FROM_TABLE, { tableId }), {
        params: { viewId },
    });
};
exports.exportCsvFromTable = exportCsvFromTable;
