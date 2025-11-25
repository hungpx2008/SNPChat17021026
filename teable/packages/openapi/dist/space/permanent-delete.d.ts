import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const PERMANENT_DELETE_SPACE = "/space/{spaceId}/permanent";
export declare const PermanentDeleteSpaceRoute: RouteConfig;
export declare const permanentDeleteSpace: (spaceId: string) => Promise<import("axios").AxiosResponse<null, any>>;
