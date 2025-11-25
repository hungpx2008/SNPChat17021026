"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenItemSchema = void 0;
const zod_1 = require("../zod");
exports.accessTokenItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    scopes: zod_1.z.array(zod_1.z.string()),
    spaceIds: zod_1.z.array(zod_1.z.string()).optional(),
    baseIds: zod_1.z.array(zod_1.z.string()).optional(),
    hasFullAccess: zod_1.z.boolean().optional(),
    expiredTime: zod_1.z.string(),
    createdTime: zod_1.z.string(),
    lastUsedTime: zod_1.z.string().optional(),
});
