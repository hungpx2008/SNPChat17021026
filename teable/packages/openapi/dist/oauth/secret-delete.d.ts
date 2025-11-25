export declare const OAUTH_SECRET_DELETE = "/oauth/client/{clientId}/secret/{secretId}";
export declare const deleteOauthSecretRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const deleteOAuthSecret: (clientId: string, secretId: string) => Promise<import("axios").AxiosResponse<void, any>>;
