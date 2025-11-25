"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collaboratorItem = exports.departmentCollaboratorItem = exports.userCollaboratorItem = exports.PrincipalType = exports.CollaboratorType = void 0;
const core_1 = require("@teable/core");
const zod_1 = require("../zod");
var CollaboratorType;
(function (CollaboratorType) {
    CollaboratorType["Space"] = "space";
    CollaboratorType["Base"] = "base";
})(CollaboratorType || (exports.CollaboratorType = CollaboratorType = {}));
var PrincipalType;
(function (PrincipalType) {
    PrincipalType["User"] = "user";
    PrincipalType["Department"] = "department";
})(PrincipalType || (exports.PrincipalType = PrincipalType = {}));
exports.userCollaboratorItem = zod_1.z.object({
    userId: zod_1.z.string(),
    userName: zod_1.z.string(),
    email: zod_1.z.string(),
    role: core_1.roleSchema,
    avatar: zod_1.z.string().nullable(),
    createdTime: zod_1.z.string(),
    type: zod_1.z.literal(PrincipalType.User),
    resourceType: zod_1.z.nativeEnum(CollaboratorType),
    isSystem: zod_1.z.boolean().optional(),
    billable: zod_1.z.boolean().optional(),
    base: zod_1.z
        .object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
    })
        .optional(),
});
exports.departmentCollaboratorItem = zod_1.z.object({
    departmentId: zod_1.z.string(),
    departmentName: zod_1.z.string(),
    role: core_1.roleSchema,
    createdTime: zod_1.z.string(),
    type: zod_1.z.literal(PrincipalType.Department),
    resourceType: zod_1.z.nativeEnum(CollaboratorType),
    base: zod_1.z
        .object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
    })
        .optional(),
});
exports.collaboratorItem = zod_1.z.discriminatedUnion('type', [
    exports.userCollaboratorItem,
    exports.departmentCollaboratorItem,
]);
