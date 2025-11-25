"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleSchema = exports.RoleLevel = exports.Role = void 0;
const zod_1 = require("../../zod");
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.Role = {
    Owner: 'owner',
    Creator: 'creator',
    Editor: 'editor',
    Commenter: 'commenter',
    Viewer: 'viewer',
};
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.RoleLevel = ['owner', 'creator', 'editor', 'commenter', 'viewer'];
exports.roleSchema = zod_1.z.nativeEnum(exports.Role);
