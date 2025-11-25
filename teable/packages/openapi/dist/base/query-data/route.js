"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseQuerySchemaVo = exports.baseQueryColumnSchema = void 0;
const core_1 = require("@teable/core");
const zod_1 = require("../../zod");
const types_1 = require("./types");
exports.baseQueryColumnSchema = zod_1.z.object({
    name: zod_1.z.string(),
    column: zod_1.z.string(),
    type: types_1.baseQueryColumnTypeSchema,
    fieldSource: core_1.fieldVoSchema.optional(),
});
exports.baseQuerySchemaVo = zod_1.z.object({
    rows: zod_1.z.array(zod_1.z.record(zod_1.z.string(), zod_1.z.unknown())),
    columns: zod_1.z.array(exports.baseQueryColumnSchema),
});
