"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.longTextFieldOptionsSchema = void 0;
const zod_1 = require("../../../zod");
exports.longTextFieldOptionsSchema = zod_1.z
    .object({
    defaultValue: zod_1.z
        .string()
        .optional()
        .transform((value) => (typeof value === 'string' ? value.trim() : value)),
})
    .strict();
