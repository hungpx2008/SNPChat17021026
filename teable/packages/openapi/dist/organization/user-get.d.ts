import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_DEPARTMENT_USER = "/organization/department-user";
export declare const getDepartmentUserRoSchema: z.ZodObject<{
    departmentId: z.ZodOptional<z.ZodString>;
    includeChildrenDepartment: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    skip: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, number, string | number>, z.ZodNumber>>;
    take: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, number, string | number>, z.ZodNumber>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    take?: number | undefined;
    skip?: number | undefined;
    departmentId?: string | undefined;
    includeChildrenDepartment?: boolean | undefined;
}, {
    search?: string | undefined;
    take?: string | number | undefined;
    skip?: string | number | undefined;
    departmentId?: string | undefined;
    includeChildrenDepartment?: string | undefined;
}>;
export type IGetDepartmentUserRo = z.infer<typeof getDepartmentUserRoSchema>;
export declare const getDepartmentUserItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    departments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        path: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        pathName: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        path?: string[] | undefined;
        pathName?: string[] | undefined;
    }, {
        name: string;
        id: string;
        path?: string[] | undefined;
        pathName?: string[] | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    email: string;
    avatar?: string | undefined;
    departments?: {
        name: string;
        id: string;
        path?: string[] | undefined;
        pathName?: string[] | undefined;
    }[] | undefined;
}, {
    name: string;
    id: string;
    email: string;
    avatar?: string | undefined;
    departments?: {
        name: string;
        id: string;
        path?: string[] | undefined;
        pathName?: string[] | undefined;
    }[] | undefined;
}>;
export type IGetDepartmentUserItem = z.infer<typeof getDepartmentUserItemSchema>;
export declare const getDepartmentUserVoSchema: z.ZodObject<{
    users: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodString>;
        departments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            path: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            pathName: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            id: string;
            path?: string[] | undefined;
            pathName?: string[] | undefined;
        }, {
            name: string;
            id: string;
            path?: string[] | undefined;
            pathName?: string[] | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
        departments?: {
            name: string;
            id: string;
            path?: string[] | undefined;
            pathName?: string[] | undefined;
        }[] | undefined;
    }, {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
        departments?: {
            name: string;
            id: string;
            path?: string[] | undefined;
            pathName?: string[] | undefined;
        }[] | undefined;
    }>, "many">;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    users: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
        departments?: {
            name: string;
            id: string;
            path?: string[] | undefined;
            pathName?: string[] | undefined;
        }[] | undefined;
    }[];
}, {
    total: number;
    users: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
        departments?: {
            name: string;
            id: string;
            path?: string[] | undefined;
            pathName?: string[] | undefined;
        }[] | undefined;
    }[];
}>;
export type IGetDepartmentUserVo = z.infer<typeof getDepartmentUserVoSchema>;
export declare const getDepartmentUsersRoute: RouteConfig;
export declare const getDepartmentUsers: (ro?: IGetDepartmentUserRo) => Promise<import("axios").AxiosResponse<{
    total: number;
    users: {
        name: string;
        id: string;
        email: string;
        avatar?: string | undefined;
        departments?: {
            name: string;
            id: string;
            path?: string[] | undefined;
            pathName?: string[] | undefined;
        }[] | undefined;
    }[];
}, any>>;
