"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupPointsVoSchema = exports.groupHeaderRefSchema = exports.GroupPointType = void 0;
const zod_1 = require("zod");
var GroupPointType;
(function (GroupPointType) {
    GroupPointType[GroupPointType["Header"] = 0] = "Header";
    GroupPointType[GroupPointType["Row"] = 1] = "Row";
})(GroupPointType || (exports.GroupPointType = GroupPointType = {}));
const groupHeaderPointSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.literal(GroupPointType.Header),
    depth: zod_1.z.number().max(2).min(0),
    value: zod_1.z.unknown(),
    isCollapsed: zod_1.z.boolean(),
});
const groupRowPointSchema = zod_1.z.object({
    type: zod_1.z.literal(GroupPointType.Row),
    count: zod_1.z.number(),
});
exports.groupHeaderRefSchema = zod_1.z.object({
    id: zod_1.z.string(),
    depth: zod_1.z.number().max(2).min(0),
});
const groupPointSchema = zod_1.z.union([groupHeaderPointSchema, groupRowPointSchema]);
exports.groupPointsVoSchema = groupPointSchema.array().nullable();
