import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const GET_SPACE_LIST = "/space";
export declare const GetSpaceListRoute: RouteConfig;
export declare const getSpaceList: () => Promise<import("axios").AxiosResponse<{
    name: string;
    id: string;
    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
    organization?: {
        name: string;
        id: string;
    } | undefined;
}[], any>>;
