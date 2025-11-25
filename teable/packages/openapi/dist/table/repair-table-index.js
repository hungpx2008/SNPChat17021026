"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repairTableIndex = exports.TableIndexRepairRoute = exports.TABLE_INDEX_REPAIR = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const toggle_table_index_1 = require("./toggle-table-index");
exports.TABLE_INDEX_REPAIR = '/base/{baseId}/table/{tableId}/index/repair';
exports.TableIndexRepairRoute = (0, utils_1.registerRoute)({
    method: 'patch',
    path: exports.TABLE_INDEX_REPAIR,
    summary: 'Repair table index',
    description: 'Repair table index',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
            type: toggle_table_index_1.tableIndexTypeSchema,
        }),
    },
    responses: {
        201: {
            description: 'Succeed',
        },
    },
    tags: ['table'],
});
const repairTableIndex = (baseId, tableId, type) => {
    return axios_1.axios.patch((0, utils_1.urlBuilder)(exports.TABLE_INDEX_REPAIR, { baseId, tableId }), undefined, {
        params: { type },
    });
};
exports.repairTableIndex = repairTableIndex;
