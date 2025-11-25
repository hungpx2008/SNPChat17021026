import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const SING_OUT = "/auth/signout";
export declare const SignoutRoute: RouteConfig;
export declare const signout: () => Promise<import("axios").AxiosResponse<null, any>>;
