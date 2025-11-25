"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrash = exports.GetTrashRoute = exports.trashVoSchema = exports.tableTrashItemVoSchema = exports.trashItemVoSchema = exports.trashRoSchema = exports.resourceMapVoSchema = exports.userMapVoSchema = exports.ResourceType = exports.GET_TRASH = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const space_1 = require("../space");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_TRASH = '/trash';
var ResourceType;
(function (ResourceType) {
    ResourceType["Space"] = "space";
    ResourceType["Base"] = "base";
    ResourceType["Table"] = "table";
    ResourceType["View"] = "view";
    ResourceType["Field"] = "field";
    ResourceType["Record"] = "record";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
exports.userMapVoSchema = zod_1.z.record(zod_1.z.string().startsWith(core_1.IdPrefix.User), space_1.userCollaboratorItem
    .pick({
    email: true,
    avatar: true,
})
    .merge(zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
})));
const fieldSnapshotItemVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    type: zod_1.z.nativeEnum(core_1.FieldType),
    isLookup: zod_1.z.boolean().nullable(),
    isConditionalLookup: zod_1.z.boolean().nullable().optional(),
    options: zod_1.z.array(zod_1.z.string()).nullish(),
});
const recordSnapshotItemVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
const viewSnapshotItemVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    type: zod_1.z.nativeEnum(core_1.ViewType),
});
exports.resourceMapVoSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.union([
    zod_1.z.object({
        id: zod_1.z.string().startsWith(core_1.IdPrefix.Space),
        name: zod_1.z.string(),
    }),
    zod_1.z.object({
        id: zod_1.z.string().startsWith(core_1.IdPrefix.Base),
        spaceId: zod_1.z.string(),
        name: zod_1.z.string(),
    }),
    zod_1.z.object({
        id: zod_1.z.string().startsWith(core_1.IdPrefix.Table),
        name: zod_1.z.string(),
    }),
    viewSnapshotItemVoSchema,
    fieldSnapshotItemVoSchema,
    recordSnapshotItemVoSchema,
]));
exports.trashRoSchema = zod_1.z.object({
    resourceType: zod_1.z.enum([ResourceType.Space, ResourceType.Base]),
});
exports.trashItemVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    resourceId: zod_1.z.string(),
    resourceType: zod_1.z.enum([ResourceType.Space, ResourceType.Base, ResourceType.Table]),
    deletedTime: zod_1.z.string(),
    deletedBy: zod_1.z.string(),
});
exports.tableTrashItemVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    resourceIds: zod_1.z.array(zod_1.z.string()),
    resourceType: zod_1.z.enum([ResourceType.View, ResourceType.Field, ResourceType.Record]),
    deletedTime: zod_1.z.string(),
    deletedBy: zod_1.z.string(),
});
exports.trashVoSchema = zod_1.z.object({
    trashItems: zod_1.z.array(zod_1.z.union([exports.trashItemVoSchema, exports.tableTrashItemVoSchema])),
    userMap: exports.userMapVoSchema,
    resourceMap: exports.resourceMapVoSchema,
    nextCursor: zod_1.z.string().nullish(),
});
exports.GetTrashRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_TRASH,
    description: 'Get trash list for spaces or bases',
    request: {
        query: exports.trashRoSchema,
    },
    responses: {
        200: {
            description: 'Get trash successfully',
            content: {
                'application/json': {
                    schema: exports.trashVoSchema,
                },
            },
        },
    },
    tags: ['trash'],
});
const getTrash = (trashRo) => {
    return axios_1.axios.get(exports.GET_TRASH, { params: trashRo });
};
exports.getTrash = getTrash;
