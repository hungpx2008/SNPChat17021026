"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTableIndex = exports.ToggleTableIndexRoute = exports.toggleIndexRoSchema = exports.tableIndexTypeSchema = exports.RecommendedIndexRow = exports.TableIndex = exports.TOGGLE_TABLE_INDEX = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.TOGGLE_TABLE_INDEX = '/base/{baseId}/table/{tableId}/index';
var TableIndex;
(function (TableIndex) {
    TableIndex["search"] = "search";
})(TableIndex || (exports.TableIndex = TableIndex = {}));
exports.RecommendedIndexRow = 10000;
exports.tableIndexTypeSchema = zod_1.z.nativeEnum(TableIndex);
exports.toggleIndexRoSchema = zod_1.z.object({
    type: exports.tableIndexTypeSchema,
});
exports.ToggleTableIndexRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.TOGGLE_TABLE_INDEX,
    summary: 'Toggle table index',
    description: 'Toggle table index',
    request: {
        params: zod_1.z.object({
            baseId: zod_1.z.string(),
            tableId: zod_1.z.string(),
        }),
        body: {
            content: {
                'application/json': {
                    schema: exports.toggleIndexRoSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'No return',
        },
    },
    tags: ['table'],
});
const toggleTableIndex = async (baseId, tableId, toggleIndexRo) => {
    return axios_1.axios.post((0, utils_1.urlBuilder)(exports.TOGGLE_TABLE_INDEX, { baseId, tableId }), toggleIndexRo);
};
exports.toggleTableIndex = toggleTableIndex;
