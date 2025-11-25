"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPinList = exports.GetPinRoute = exports.IGetPinListVoSchema = exports.GET_PIN_LIST = void 0;
const core_1 = require("@teable/core");
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
const types_1 = require("./types");
exports.GET_PIN_LIST = '/pin/list';
exports.IGetPinListVoSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.nativeEnum(types_1.PinType),
    order: zod_1.z.number(),
    name: zod_1.z.string(),
    icon: zod_1.z.string().optional(),
    parentBaseId: zod_1.z.string().optional(),
    viewMeta: zod_1.z
        .object({
        tableId: zod_1.z.string(),
        type: zod_1.z.nativeEnum(core_1.ViewType),
        pluginLogo: zod_1.z.string().optional(),
    })
        .optional(),
}));
exports.GetPinRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_PIN_LIST,
    description: 'Get  pin list',
    responses: {
        200: {
            description: 'Get  pin list, include base pin',
            content: {
                'application/json': {
                    schema: exports.IGetPinListVoSchema,
                },
            },
        },
    },
    tags: ['pin'],
});
const getPinList = () => {
    return axios_1.axios.get(exports.GET_PIN_LIST);
};
exports.getPinList = getPinList;
