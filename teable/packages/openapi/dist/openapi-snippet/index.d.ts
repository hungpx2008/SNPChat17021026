/**
 * Return snippets for all endpoints in the given OpenAPI document.
 *
 * @param {object} openApi  OpenAPI document
 * @param {array} targets   List of languages to create snippets in, e.g,
 *                          ['cURL', 'Node']
 */
export function getSnippets(openApi: object, targets: array): {
    method: any;
    url: any;
    description: any;
    resource: string;
    snippets: {
        title: any;
        content: any;
        mimeType?: string | undefined;
        id: array;
    }[];
}[];
/**
 * Return snippets for endpoint identified using path and method in the given
 * OpenAPI document.
 *
 * @param {object} openApi  OpenAPI document
 * @param {string} path     Path identifying endpoint, e.g., '/users'
 * @param {string} method   HTTP method identifying endpoint, e.g., 'get'
 * @param {array} targets   List of languages to create snippets in, e.g,
 *                          ['cURL', 'Node']
 * @param {object} [values] Optional: Values for the query parameters if present
 */
export function getEndpointSnippets(openApi: object, path: string, method: string, targets: array, values?: object | undefined): {
    method: any;
    url: any;
    description: any;
    resource: string;
    snippets: {
        title: any;
        content: any;
        mimeType?: string | undefined;
        id: array;
    }[];
};
