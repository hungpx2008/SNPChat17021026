export declare const createAxios: () => import("axios").AxiosInstance;
declare const axios: import("axios").AxiosInstance;
/**
 * Configuration options for the Axios instance.
 */
export interface IAPIRequestConfig {
    /**
     * API endpoint, defaults to 'https://app.teable.ai'.
     */
    endpoint?: string;
    /**
     * Bearer token for authentication.
     */
    token: string;
    /**
     * Enable undo/redo functionality for API calls related to record, field, and view mutations
     */
    enableUndoRedo?: boolean;
}
/**
 * Configures the Axios instance with the provided options.
 * @param config - Configuration options
 */
export declare const configApi: (config: IAPIRequestConfig) => import("axios").AxiosInstance;
export { axios };
