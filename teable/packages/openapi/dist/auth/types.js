"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupPasswordSchema = exports.passwordSchema = void 0;
const zod_1 = require("../zod");
exports.passwordSchema = zod_1.z.string().min(8).openapi({
    description: 'Minimum 8 chars',
});
exports.signupPasswordSchema = exports.passwordSchema.regex(/^(?=.*[A-Z])(?=.*\d).{8,}$/i, 'Must contain at least one letter and one number');
