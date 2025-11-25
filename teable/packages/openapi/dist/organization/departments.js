"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentList = exports.getDepartmentListRoute = exports.getDepartmentListVoSchema = exports.getDepartmentVoSchema = exports.getDepartmentListRoSchema = exports.GET_DEPARTMENT_LIST = void 0;
const axios_1 = require("../axios");
const utils_1 = require("../utils");
const zod_1 = require("../zod");
exports.GET_DEPARTMENT_LIST = '/organization/department';
exports.getDepartmentListRoSchema = zod_1.z.object({
    parentId: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    includeChildrenDepartment: zod_1.z
        .string()
        .transform((value) => value === 'true')
        .optional(),
});
exports.getDepartmentVoSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    parentId: zod_1.z.string().optional(),
    path: zod_1.z.array(zod_1.z.string()).optional(),
    pathName: zod_1.z.array(zod_1.z.string()).optional(),
    hasChildren: zod_1.z.boolean(),
});
exports.getDepartmentListVoSchema = zod_1.z.array(exports.getDepartmentVoSchema);
exports.getDepartmentListRoute = (0, utils_1.registerRoute)({
    method: 'get',
    path: exports.GET_DEPARTMENT_LIST,
    request: {
        params: zod_1.z.object({
            organizationId: zod_1.z.string(),
        }),
        query: exports.getDepartmentListRoSchema,
    },
    responses: {
        200: {
            description: 'Get department list successfully',
            content: { 'application/json': { schema: exports.getDepartmentListVoSchema } },
        },
    },
    tags: ['organization'],
});
const getDepartmentList = (ro) => {
    return axios_1.axios.get(exports.GET_DEPARTMENT_LIST, {
        params: ro,
    });
};
exports.getDepartmentList = getDepartmentList;
