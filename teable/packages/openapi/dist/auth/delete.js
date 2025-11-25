"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.deleteUserRoute = exports.deleteUserSchemaRo = exports.deleteUserErrorDataSchema = exports.DELETE_USER = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.DELETE_USER = '/auth/user';
exports.deleteUserErrorDataSchema = zod_1.z.object({
    spaces: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        deletedTime: zod_1.z.string().nullable(),
    })),
});
exports.deleteUserSchemaRo = zod_1.z.object({
    confirm: zod_1.z
        .string()
        .describe('Please enter DELETE to confirm')
        .refine((val) => val === 'DELETE', {
        message: 'Please enter DELETE to confirm',
    }),
});
exports.deleteUserRoute = (0, utils_1.registerRoute)({
    method: 'delete',
    path: exports.DELETE_USER,
    description: 'Delete user',
    responses: {
        200: {
            description: 'Successfully deleted user',
        },
        400: {
            description: 'User has deleted bases or spaces',
            content: {
                'application/json': {
                    schema: exports.deleteUserErrorDataSchema,
                },
            },
        },
    },
    request: {
        params: exports.deleteUserSchemaRo,
    },
    tags: ['auth'],
});
const deleteUser = async (confirm) => {
    return axios_1.axios.delete(exports.DELETE_USER, {
        params: {
            confirm,
        },
    });
};
exports.deleteUser = deleteUser;
