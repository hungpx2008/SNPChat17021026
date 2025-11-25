"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentUsers = exports.getDepartmentUsersRoute = exports.getDepartmentUserVoSchema = exports.getDepartmentUserItemSchema = exports.getDepartmentUserRoSchema = exports.GET_DEPARTMENT_USER = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_DEPARTMENT_USER = '/organization/department-user';
exports.getDepartmentUserRoSchema = zod_1.z.object({
    departmentId: zod_1.z.string().optional(),
    includeChildrenDepartment: zod_1.z
        .string()
        .transform((value) => value === 'true')
        .optional(),
    skip: zod_1.z.string().or(zod_1.z.number()).transform(Number).pipe(zod_1.z.number().min(0)).optional().openapi({
        example: 0,
    }),
    take: zod_1.z.string().or(zod_1.z.number()).transform(Number).pipe(zod_1.z.number().min(1)).optional().openapi({
        example: 50,
    }),
    search: zod_1.z.string().optional(),
});
exports.getDepartmentUserItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    avatar: zod_1.z.string().optional(),
    departments: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        path: zod_1.z.array(zod_1.z.string()).optional(),
        pathName: zod_1.z.array(zod_1.z.string()).optional(),
    }))
        .optional(),
});
exports.getDepartmentUserVoSchema = zod_1.z.object({
    users: zod_1.z.array(exports.getDepartmentUserItemSchema),
    total: zod_1.z.number(),
});
exports.getDepartmentUsersRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_DEPARTMENT_USER,
    request: {
        params: zod_1.z.object({
            organizationId: zod_1.z.string(),
        }),
        query: exports.getDepartmentUserRoSchema,
    },
    responses: {
        200: {
            description: 'Get department users successfully',
            content: { 'application/json': { schema: exports.getDepartmentUserVoSchema } },
        },
    },
    tags: ['organization'],
});
const getDepartmentUsers = (ro) => {
    return axios_1.axios.get(exports.GET_DEPARTMENT_USER, {
        params: ro,
    });
};
exports.getDepartmentUsers = getDepartmentUsers;
