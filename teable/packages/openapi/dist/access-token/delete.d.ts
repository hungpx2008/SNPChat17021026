export declare const DELETE_ACCESS_TOKEN = "/access-token/{id}";
export declare const deleteAccessRoute: import("@asteasolutions/zod-to-openapi").RouteConfig;
export declare const deleteAccessToken: (id: string) => Promise<import("axios").AxiosResponse<void, any>>;
