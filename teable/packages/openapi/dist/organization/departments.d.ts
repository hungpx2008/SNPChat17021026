import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from '../zod';
export declare const GET_DEPARTMENT_LIST = "/organization/department";
export declare const getDepartmentListRoSchema: z.ZodObject<{
    parentId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    includeChildrenDepartment: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    parentId?: string | undefined;
    includeChildrenDepartment?: boolean | undefined;
}, {
    search?: string | undefined;
    parentId?: string | undefined;
    includeChildrenDepartment?: string | undefined;
}>;
export type IGetDepartmentListRo = z.infer<typeof getDepartmentListRoSchema>;
export declare const getDepartmentVoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    pathName: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    hasChildren: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    hasChildren: boolean;
    path?: string[] | undefined;
    parentId?: string | undefined;
    pathName?: string[] | undefined;
}, {
    name: string;
    id: string;
    hasChildren: boolean;
    path?: string[] | undefined;
    parentId?: string | undefined;
    pathName?: string[] | undefined;
}>;
export type IGetDepartmentVo = z.infer<typeof getDepartmentVoSchema>;
export declare const getDepartmentListVoSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    pathName: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    hasChildren: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    hasChildren: boolean;
    path?: string[] | undefined;
    parentId?: string | undefined;
    pathName?: string[] | undefined;
}, {
    name: string;
    id: string;
    hasChildren: boolean;
    path?: string[] | undefined;
    parentId?: string | undefined;
    pathName?: string[] | undefined;
}>, "many">;
export type IGetDepartmentListVo = z.infer<typeof getDepartmentListVoSchema>;
export declare const getDepartmentListRoute: RouteConfig;
export declare const getDepartmentList: (ro: IGetDepartmentListRo) => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    hasChildren: boolean;
    path?: string[] | undefined;
    parentId?: string | undefined;
    pathName?: string[] | undefined;
}[], any>>;
