"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importBase = exports.ImportBaseRoute = exports.importBaseRoSchema = exports.importBaseVoSchema = exports.IMPORT_BASE = void 0;
const attachment_1 = require("../attachment");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const create_1 = require("./create");
exports.IMPORT_BASE = '/base/import';
exports.importBaseVoSchema = zod_1.z.object({
    base: create_1.createBaseVoSchema,
    tableIdMap: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
    fieldIdMap: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
    viewIdMap: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
});
exports.importBaseRoSchema = zod_1.z.object({
    notify: attachment_1.notifyVoSchema,
    spaceId: zod_1.z.string(),
});
exports.ImportBaseRoute = (0, utils_1.registerRoute)({
    method: 'post',
    path: exports.IMPORT_BASE,
    description: 'import a base',
    summary: 'import a base',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: exports.importBaseRoSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'import successfully',
        },
    },
    tags: ['base'],
});
const importBase = async (importBaseRo) => {
    return await axios_1.axios.post((0, utils_1.urlBuilder)(exports.IMPORT_BASE), importBaseRo);
};
exports.importBase = importBase;
