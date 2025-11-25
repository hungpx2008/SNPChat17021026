export declare const REVOKE_ACCESS = "/oauth/client/{clientId}/revoke-access";
export declare const revokeAccessRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const revokeAccess: (clientId: string) => Promise<import("axios").AxiosResponse<void, any>>;
