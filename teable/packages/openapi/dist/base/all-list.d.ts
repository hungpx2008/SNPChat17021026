import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { IGetBaseVo } from './get';
export declare const GET_BASE_ALL = "/base/access/all";
export type IGetBaseAllVo = Omit<IGetBaseVo, 'collaboratorType'>[];
export declare const GetBaseAllRoute: RouteConfig;
export declare const getBaseAll: () => Promise<import("axios").AxiosResponse<IGetBaseAllVo, any>>;
