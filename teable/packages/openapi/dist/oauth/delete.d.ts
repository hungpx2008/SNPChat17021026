export declare const OAUTH_DELETE = "/oauth/client/{clientId}";
export declare const deleteOauthRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const oauthDelete: (clientId: string) => Promise<import("axios").AxiosResponse<void, any>>;
