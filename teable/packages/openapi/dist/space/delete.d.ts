import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_SPACE = "/space/{spaceId}";
export declare const DeleteSpaceRoute: RouteConfig;
export declare const deleteSpace: (spaceId: string) => Promise<import("axios").AxiosResponse<null, any>>;
