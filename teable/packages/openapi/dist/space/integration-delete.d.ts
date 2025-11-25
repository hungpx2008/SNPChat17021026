import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
export declare const DELETE_INTEGRATION = "/space/{spaceId}/integration/{integrationId}";
export declare const DeleteIntegrationRoute: RouteConfig;
export declare const deleteIntegration: (spaceId: string, integrationId: string) => Promise<import("axios").AxiosResponse<null, any>>;
